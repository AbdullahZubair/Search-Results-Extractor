// Extract all main web result links from all Google search result pages
async function extractLinksFromTab(tabId) {
  let allLinks = [];
  let page = 1;
  let hasNext = true;
  let lastUrl = null;
  while (hasNext) {
    // Extract links from the current page
    const [{ result: links }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const links = [];
        document.querySelectorAll('div.g, div[data-snc]').forEach(g => {
          const a = g.querySelector('a[href]');
          if (a && a.href && !a.href.startsWith('https://webcache.googleusercontent.com')) {
            links.push(a.href);
          }
        });
        return links;
      }
    });
    allLinks = allLinks.concat(links);
    // Check for Next button
    const [{ result: nextInfo }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const nextBtn = document.querySelector('a#pnnext, a[aria-label="Next page"], a[aria-label="Next"]');
        return nextBtn && !nextBtn.getAttribute('aria-disabled') ? nextBtn.href : null;
      }
    });
    if (nextInfo && nextInfo !== lastUrl) {
      lastUrl = nextInfo;
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (url) => { window.location.href = url; },
        args: [nextInfo]
      });
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      page++;
    } else {
      hasNext = false;
    }
  }
  // Remove duplicates
  allLinks = Array.from(new Set(allLinks));
  return allLinks;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request && request.type === 'START_EXTRACTION') {
    const { tabId } = request;
    extractLinksFromTab(tabId).then(links => {
      sendResponse({ links });
    });
    return true; // Indicate async response
  }
}); 