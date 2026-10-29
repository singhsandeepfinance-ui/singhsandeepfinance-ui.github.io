# How to add articles and PDFs

You never need to touch the design code. Day to day you only work in three places:

| What you want to do | Where |
|---|---|
| Write an article | the `_posts` folder |
| Add a PDF | the `pdfs` folder **and** `_data/library.yml` |
| Add a paper to the Research page | `_data/research.yml` |
| Add a term to the glossary | `_data/glossary.yml` |
| Add your photo | `assets/img/profile.jpg` **and** `_config.yml` |
| Change your name, email or links | `_config.yml` |

After any change, **publish** it (see the last section). The live site updates in about 1–2 minutes.

---

## 1. Write a new article

1. In VS Code, right-click the `_posts` folder → **New File**.
2. Name it with the date first, then a short title with dashes, ending in `.md`:
   `2026-11-05-how-to-read-a-mutual-fund-factsheet.md`
3. Paste this at the very top and fill it in:

```markdown
---
title: "How to read a mutual fund factsheet"
description: "One or two sentences that appear under the title and in Google results."
topic: personal-finance
---

Write your article here.
```

**topic** must be one of: `personal-finance`, `markets`, `research`, `fintech`.
(You can add or rename topics in `_data/topics.yml`.)

4. Write the article below the `---` lines using simple formatting:

| You type | You get |
|---|---|
| `## A heading` | a section heading |
| `### A smaller heading` | a sub-heading |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `- item` on each line | a bullet list |
| `1. item` on each line | a numbered list |
| `[link text](https://example.com)` | a link |
| `> quoted text` | a quote |
| a blank line | a new paragraph |

**Tables**

```markdown
| Year | Return |
|-----:|-------:|
| 2024 | 12.4%  |
| 2025 | 9.1%   |
```

(The `-----:` with a colon on the right makes numbers line up on the right.)

**Pictures** — put the image in `assets/img/posts/`, then write:

```markdown
![Short description of the picture]({{ '/assets/img/posts/my-chart.png' | relative_url }})
```

**Maths formulas** — add `math: true` to the top section, then use `$$`:

```markdown
Inline: the return is $$r$$.

On its own line:

$$
\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2 w_1 w_2 \rho \sigma_1 \sigma_2
$$
```

**Optional extras in the top section**

```yaml
math: true                         # turns on maths formulas
pdf: my-notes.pdf                  # shows a "Download PDF" box at the end (file must be in /pdfs)
pdf_title: "Lecture notes (12 pages)"
```

To **hide a draft** until it is ready, add `published: false` to the top section.
To **delete** an article, delete its file.

---

## 2. Add a PDF to the library

1. Copy your PDF into the `pdfs` folder. Rename it to something short with no spaces, e.g. `capm-lecture-notes.pdf`.
2. Open `_data/library.yml` and add a block **at the top of the list** (keep the same spacing):

```yaml
- title: CAPM lecture notes
  file: capm-lecture-notes.pdf
  type: Notes
  topic: research
  date: 2026-11-05
  pages: 12
  description: >-
    One or two sentences about what is inside.
```

`type` is shown as a filter on the library page. Good choices: Guide, Notes, Paper, Slides, Worksheet.

Keep each PDF under about 25 MB, and the whole site under 1 GB. For very large files, upload them to Google Drive and link to them from an article instead.

> **Copyright:** only upload PDFs you wrote or have permission to share. For your published papers, check the journal's sharing policy first; most allow a preprint or accepted manuscript.

---

## 3. Add a paper to the Research page

Open `_data/research.yml`. Under `papers:` copy the example block, remove the `#` at the start of each line, and fill it in. Keep the two-space indent:

```yaml
papers:
  - title: "Title of your paper"
    authors: "Sandeep Singh, Co-author Name"
    venue: "Journal or conference name"
    year: 2026
    status: Working paper
    link: "https://ssrn.com/abstract=0000000"
    pdf: ""
```

Until you add one, the page shows buttons to your SSRN and ResearchGate profiles instead.
You can also edit the four **interests** in the same file.

---

## 4. Add your photo

1. Save a square photo (about 600 × 600 pixels) as `profile.jpg` inside `assets/img`.
2. In `_config.yml`, change `photo: ""` to `photo: /assets/img/profile.jpg`.

It then replaces the "SS" badge on the home page, About page and under every article.

---

## 5. Add a glossary term

Open `_data/glossary.yml` and copy any block. The page sorts terms A–Z by itself.

---

## 6. Publish your changes

**From VS Code (easiest):**

1. Click the **Source Control** icon on the left (it looks like a branch, or press `Ctrl+Shift+G`).
2. Type a short message such as `New article on factsheets`.
3. Click **Commit**, then **Sync Changes** (or **Push**).

**From the GitHub website (no VS Code needed):**
open your repository → go into the right folder → **Add file → Upload files** → **Commit changes**.

To see whether the update worked, open the **Actions** tab of your repository. A green tick means it's live; a red cross means something in a file needs fixing (usually a missing `---` or a bad space in `library.yml`).

---

## 7. Change site details

Open `_config.yml` to change your title, tagline, description, email and profile links. Save and publish as above.
