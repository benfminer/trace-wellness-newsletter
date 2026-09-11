# Sending the playlist email from Outlook

Two files here:

- `playlist-launch.html` — the formatted email
- `playlist-launch.txt` — plain-text fallback, for anyone whose client refuses HTML

## Subject line options

- Send us the song that gets you through the day
- One playlist, built by all of us
- What's your "long day" song?

## Getting it into Outlook

**Windows Outlook (most reliable):** File → Options → Mail → Signatures, make a
new signature, and paste the rendered page into it. Then insert that signature
into a new message. Sounds silly; it's the method that preserves table layout
best.

**Simpler, works everywhere:** open `playlist-launch.html` in Chrome, Select All
(Cmd/Ctrl+A), Copy, then paste into a new Outlook message body. Check the
result before sending — pasting is lossy in a way the file itself is not.

**Best of all, if you have access:** send it through whatever mass-mail tool the
district uses. Those accept raw HTML and don't re-process it.

## Before you hit send

1. Mail it to yourself first. Open it on your phone *and* on desktop Outlook.
2. Click both links from that test message — the form and the board.
3. Send to a distribution list using **Bcc**, so nobody can reply-all.

## What's deliberately not in here

No images. Outlook hides remote images until the reader clicks "Download
pictures," so anything important inside one is invisible on first open. The
design is built to look finished with zero images loaded. If you want a hero
image later, host it on the GitHub Pages site and drop it in above the title —
as decoration, never carrying the message.

No tracking pixels, no analytics, no open tracking of staff email.
