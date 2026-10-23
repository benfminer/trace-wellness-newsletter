# Setting up the book club form

This connects the Reading Room board (`book-club/index.html`) to a Google Form.
It works the same way as the song board: a form collects posts, a sheet holds
them, one trimmed tab of that sheet is published, and the board reads it.

Posts go up right away. There is no approval step.

## 1. Make the form

Make it from your district Google account so you can restrict it to staff.

**Title:** The Reading Room: The God of the Woods

**Description:**
> Share a thought about the book. Pick the part you are reading now, so people
> who are behind you don't get spoiled. Your post goes up on the board right
> away, so keep it kind.

**Questions, in this order:**

| # | Question (copy exactly) | Type | Required |
|---|---|---|---|
| 1 | How far in are you? | Multiple choice | Yes |
| 2 | What do you think so far? | Paragraph | Yes |
| 3 | Your name (optional) | Short answer | No |

**Options for question 1, exactly as written:**

- Part 1
- Part 2
- Part 3
- Part 4
- Part 5
- Part 6
- Part 7
- I finished it

Use numbers, not the part names. "When Lost" and "Found" hint at the plot,
and the board only shows a part's name once a reader has gotten there.

**Help text under question 2** (the three-dot menu, then Description):
> One line is plenty. If you mention something from a later part, choose that
> part above.

### Why the wording matters

The board finds each column by keywords in the question:

- "**how far**" is the part question
- "**think**" is the post itself
- "**name**" is the name

You can reword a question, but keep that word in it. Don't put "how far" or
"name" into the post question. In the part answers, keep the digit (1 through 7)
or the word "finished". If the board can't place an answer, it files the post
under Finished, so a confusing answer gets hidden instead of spoiling something.

## 2. Form settings

Settings, then Responses:

- **Collect email addresses:** Verified
- **Restrict to users in San Diego Unified** (and trusted orgs): on
- **Allow response editing:** off
- **Limit to 1 response:** off (people should be able to post more than once)

Settings, then Presentation:

- **Confirmation message:**
  > Thanks. Your post is on the board now. Refresh the page to see it.

## 3. Link the sheet and make a Public tab

1. In the form, open **Responses**, then **Link to Sheets**, and create a new
   spreadsheet.
2. Open the sheet. The responses tab is called **Form Responses 1**, with
   these columns:
   A Timestamp, B Email Address, C How far in are you?, D What do you think so
   far?, E Your name (optional)
3. Add a new tab and name it **Public**.
4. In cell **A1** of Public, paste this:
   ```
   ={'Form Responses 1'!A:A, 'Form Responses 1'!C:E}
   ```
   That copies everything except the email column.
5. **Check the Public tab.** It should show Timestamp, How far, What do you
   think, and Your name. If you see any email addresses, stop and fix the
   formula before going on.

Keep the timestamp. The board uses it to show the date on each post and to put
the newest posts first.

## 4. Publish only the Public tab

1. **File**, **Share**, **Publish to web**
2. In the first dropdown, choose **Public** (the tab, not "Entire document")
3. In the second dropdown, choose **Comma-separated values (.csv)**
4. Under "Published content and settings," make sure **Automatically republish
   when changes are made** is checked
5. Click **Publish** and copy the link. It ends in `output=csv`.

The published CSV can be opened by anyone with the link. That's why the email
column has to stay out of it.

## 5. Send me the two links

Send me:

- **The form link:** in the form, click **Send**, then the link icon, and copy it.
  It ends in `/viewform`.
- **The CSV link** from step 4.

They go into the `CONFIG` block near the bottom of `book-club/index.html`:

```js
var CONFIG = {
  FORM_URL:  "https://docs.google.com/forms/d/e/.../viewform",
  SHEET_CSV: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
};
```

Once both are in, the sample posts disappear, the "Post a thought" buttons
work, and the yellow "Sample posts" tag is replaced by a count of real posts.

## 6. Test it before launch

1. Post one test response for Part 1 and one for Part 6.
2. Wait about five minutes. Google's published CSV runs a few minutes behind.
3. Open the board with your spot set to Part 1. The Part 1 post should be
   readable, and the Part 6 post should be blurred.
4. Delete both test rows from **Form Responses 1**. The Public tab follows
   along automatically.

## Taking a post down

Delete its row in **Form Responses 1**. It's off the board within a few
minutes. If someone puts a spoiler in the wrong part, you can also change their
answer in column C (for example, to "Part 6") to move the post instead of
deleting it.
