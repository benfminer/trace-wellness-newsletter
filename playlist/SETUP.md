# Connecting the song form

**Status: connected.** Both URLs are set in `playlist-data.js`. The form opens
from every "Add your song" button, and the board reads the published CSV live.
The steps below are kept as a record of how it was set up, and for the day you
need to redo it.

The published sheet has no email column, so nothing sensitive is exposed. If you
ever turn on "Collect email addresses", re-read the warning in step 2 before
republishing.

## 1. Make the Google Form — done

The form exists and is wired in. For reference, the page finds each column by
keyword, so if you ever reword a question keep the bolded word in it:

| # | Question | Type | Required |
|---|---|---|---|
| 1 | What **song** is it? | Short answer | yes |
| 2 | Who's the **artist**? | Short answer | no |
| 3 | Your **name** (optional) | Short answer | no |
| 4 | **What** does this song do for you? | Paragraph | no |

Under Settings → Responses, turn on **Collect email addresses** and restrict to
your district. That gives you accountability without you having to moderate,
which matters because whatever gets typed appears on a public page.

## 2. Publish the responses Sheet

An `/edit` link won't work here — it answers 401 to anyone who isn't signed in
with access. Google generates a separate, public URL, and that's the one the
page needs.

### First: don't publish the whole sheet

If the form collects email addresses, the responses sheet has an **Email
Address** column, and publishing that sheet puts every staff email on the open
internet. The page would never display them, but the CSV is public — anyone
could open the URL and read the column directly. Same problem we solved on the
committee roster, so let's not reintroduce it.

Publish a trimmed copy instead:

1. In the responses spreadsheet, add a new tab. Name it **Public**.
2. In cell **A1** of that tab, enter:
   ```
   ={'Form Responses 1'!B:E}
   ```
   That mirrors the four question columns and leaves the timestamp (column A)
   and the email column behind. Adjust the letters if your columns sit
   elsewhere — what matters is that the Public tab shows the four questions
   *with their header row*, and no email addresses.
3. Check the Public tab. If you see an email column, fix the range before
   going any further.

### Then publish that one tab

**File → Share → Publish to web** → in the dropdown pick **Public** (the tab,
not "Entire document") → choose **Comma-separated values (.csv)** → **Publish**.

Copy the URL it gives you. It looks like:

```
https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
```

Note the `/d/e/` and the `2PACX-` — that's how you can tell it apart from an
edit link.

> If your district Workspace admin has publishing disabled, the option will be
> missing or error. That's the one thing that can block this approach — tell
> Claude and we'll switch to different plumbing (a small script that commits
> submissions into the repo instead of reading them live).

## 3. Paste both URLs

Open `playlist-data.js` and fill in:

```js
var CONFIG = {
  FORM_URL:  "https://docs.google.com/forms/d/e/…/viewform",
  SHEET_CSV: "https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv"
};
```

Commit, push, done. Both the `/playlist/` cloud and the September teaser read
from that one config.

## Notes

- **Grouping.** Songs are matched on the title alone, normalised — case,
  punctuation, "&" vs "and", and anything in parentheses are ignored. So
  "September" and "september " merge even when one person writes "Earth, Wind &
  Fire" and another writes "EW&F".
- **Caching.** Google's published CSV can lag a few minutes behind a new
  response. That's Google's cache, not the page.
- **Sample data.** `songs.js` holds the fallback list shown when the Sheet is
  unreachable or not yet connected. It's a `.js` file rather than `.json`
  because browsers block `fetch()` for pages opened straight off the disk, so a
  JSON file would leave the page blank until it was served over http — this way
  double-clicking the HTML previews correctly. Once the form is live it's only a
  safety net; you can empty the list or paste real submissions in.
- **Previewing locally.** The page renders fine from `file://`, but the *live*
  Sheet won't load there — cross-origin fetch is blocked for local files, so
  you'll always see the sample list with its red badge. To check real data
  before pushing, run `python3 -m http.server` in the repo root and open
  `http://localhost:8000/playlist/`.
- **Taking a song down.** Delete the row in the responses Sheet. The page
  follows within a few minutes.
