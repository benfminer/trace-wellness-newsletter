#!/usr/bin/env python3
"""Turn a newsletter index.html into the artifact-preview.html we publish.

Artifacts are served on claude.ai under a strict CSP: no external images, no
relative paths back to GitHub Pages. So this does three things:

  1. strips the doctype/html/head/body wrapper (the Artifact host adds its own)
  2. inlines every local image as a data: URI
  3. rewrites every relative link to its absolute github.io address

Usage:  python3 build-artifact-preview.py trace-wellness-september
        python3 build-artifact-preview.py .
"""

import base64
import mimetypes
import os
import re
import sys

BASE = "https://benfminer.github.io/trace-wellness-newsletter/"
ROOT = os.path.dirname(os.path.abspath(__file__))

# the wrapper tags the Artifact host supplies for us
WRAPPER = ("<!doctype html>", '<html lang="en">', "<head>",
           "</head>", "<body>", "</body>", "</html>")


def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    with open(path, "rb") as fh:
        return "data:%s;base64,%s" % (mime, base64.b64encode(fh.read()).decode())


def build(page_dir):
    src = os.path.join(ROOT, page_dir, "index.html")
    out = os.path.join(ROOT, page_dir, "artifact-preview.html")
    html = open(src, encoding="utf-8").read()

    # 1. drop the wrapper tags, each of which sits alone on its own line
    html = "\n".join(l for l in html.split("\n") if l.strip() not in WRAPPER)

    # 2. relative hrefs become absolute github.io links, so they still work
    #    when the page is served from claude.ai
    def abs_href(m):
        target = os.path.normpath(os.path.join(page_dir, m.group(1)))
        suffix = "/" if m.group(1).endswith("/") else ""
        return 'href="%s%s%s"' % (BASE, target.lstrip("./"), suffix)

    html = re.sub(r'href="((?!https?:|mailto:|#|data:)[^"]+)"', abs_href, html)

    # 3. local images get inlined; anything already a data: URI is left alone
    inlined = []

    def inline_src(m):
        rel = m.group(1)
        path = os.path.join(ROOT, os.path.normpath(os.path.join(page_dir, rel)))
        if not os.path.isfile(path):
            print("  ! missing, left as-is: %s" % rel)
            return m.group(0)
        inlined.append(rel)
        return 'src="%s"' % data_uri(path)

    html = re.sub(r'src="((?!https?:|data:)[^"]+)"', inline_src, html)

    # ...and so do CSS background images. `url(#foo)` points at an SVG
    # gradient in the same document, so leave those alone.
    def inline_url(m):
        rel = m.group(1)
        path = os.path.join(ROOT, os.path.normpath(os.path.join(page_dir, rel)))
        if not os.path.isfile(path):
            print("  ! missing, left as-is: %s" % rel)
            return m.group(0)
        inlined.append(rel)
        return 'url("%s")' % data_uri(path)

    html = re.sub(r'url\("((?!https?:|data:|#)[^"]+)"\)', inline_url, html)

    open(out, "w", encoding="utf-8").write(html)
    print("%s -> %s" % (src, out))
    print("  inlined %d image(s), %.1f MB total" % (len(inlined), len(html) / 1e6))


if __name__ == "__main__":
    targets = sys.argv[1:] or ["."]
    for t in targets:
        build(t.rstrip("/") or ".")
