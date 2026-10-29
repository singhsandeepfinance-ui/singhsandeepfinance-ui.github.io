# Sandeep Singh — finance website

A free, fast website for articles and PDFs on finance and money, hosted on GitHub Pages.

- **Blog** with topics (personal finance, markets, research notes, crypto & fintech), search and share buttons
- **PDF library** with read-online and download buttons
- **SIP calculator** on the home page
- About and Contact pages, RSS feed, sitemap and Google-friendly page titles

Day-to-day instructions are in **HOW-TO-POST.md**.

## One-time setup (about 10 minutes)

1. **Create the repository.** On github.com click **+ → New repository**.
   Name it exactly `YOUR-USERNAME.github.io` (your GitHub username, all lowercase), keep it **Public**, and click **Create repository**.
2. **Upload the site.** In VS Code, open this folder, click **Source Control** (`Ctrl+Shift+G`) → **Publish to GitHub**, or follow the commands GitHub shows on the empty repository page.
3. **Turn on Pages.** In the repository: **Settings → Pages**. Under *Build and deployment*, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and click **Save**.
4. **Set your address.** In `_config.yml`, replace `YOUR-GITHUB-USERNAME` in the `url` line with your username. Commit and push.
5. Wait 1–2 minutes and open `https://YOUR-USERNAME.github.io`.

If you named the repository something else (for example `finance-site`), the address becomes `https://YOUR-USERNAME.github.io/finance-site/` and you must set `baseurl: "/finance-site"` in `_config.yml`.

## Optional: your own domain

Buy a domain (for example `sandeepsingh.in`) from any registrar, then add it under **Settings → Pages → Custom domain** and follow GitHub's DNS instructions. Update `url` in `_config.yml` to match. This is the only part that costs money.

## Folder map

```
_posts/        your articles (one Markdown file each)
pdfs/          your PDF files
_data/         library.yml (PDF list) and topics.yml (blog topics and colours)
_config.yml    site title, links and settings
about.md       About page        contact.md   Contact page
_layouts/ _includes/ assets/   design files (no need to edit)
tools/         helper scripts used while building the site (not published)
```
