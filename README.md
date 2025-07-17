# Search Results Extractor Chrome Extension

## Overview

**Search Results Extractor** is a Chrome extension designed to extract and save all links from Google search results pages—not just the first page, but every page of results that Google allows access to. It is especially useful for site owners, SEOs, and webmasters who need to audit or clean up indexed URLs for a domain.

## Why Was This Extension Made?

This extension was created out of necessity while cleaning a hacked WordPress website that had fallen victim to the Japanese SEO hack. The hack resulted in thousands of spam URLs being indexed on Google. Existing tools and manual methods only allowed extraction from the first page or a limited set of results, making it extremely difficult to get a comprehensive list of all indexed URLs for cleanup and removal.

**Search Results Extractor** was built to solve this problem: to quickly and easily extract all indexed URLs for a given query or site from Google, across all available result pages.

## Features

- Extracts all main web result links from every accessible Google search results page for your query.
- Simple, clean popup UI.
- One-click download of all extracted links as a `.txt` file.
- Works with any Google search, including `site://yourdomain.com` queries for site-specific indexing.
- No manual page-by-page copying—fully automated.

## How to Use

1. **Install the extension** in Chrome (load as unpacked extension in developer mode).
2. **Go to Google** and perform your search (e.g., `site://yourdomain.com`).
3. **Open the extension popup**.
4. Click **Extract Results**. The extension will automatically paginate through all result pages and extract all links.
5. When extraction is complete, you’ll see the total number of links found. Click **Download as .txt** to save them.
6. Use the **Close** button to close the popup when done.

## Technical Overview

- Uses Chrome's `scripting` and `tabs` APIs to inject extraction logic and automate navigation through result pages.
- Deduplicates links and provides a clean, ready-to-use list.
- No content scripts or background polling—everything is handled efficiently via background service worker and popup.

## Disclaimer

- This extension is for personal and site audit use. Google may limit the number of accessible results/pages.
- Not affiliated with or endorsed by Google.

---

**Built to help webmasters and site owners regain control after a hack, and to make large-scale Google index audits fast and easy.** 