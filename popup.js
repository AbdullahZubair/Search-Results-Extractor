let lastExtractedLinks = [];

const showDownloadButton = (show) => {
  document.getElementById('downloadBtn').style.display = show ? 'block' : 'none';
};

// Download links as .txt file
const handleDownload = () => {
  if (!lastExtractedLinks.length) return;
  const blob = new Blob([lastExtractedLinks.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'search-results.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

document.getElementById('downloadBtn').addEventListener('click', handleDownload);

document.getElementById('closeBtn').addEventListener('click', () => window.close());

document.getElementById('extractBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const summary = document.getElementById('summary');
  status.textContent = 'Extracting links from all pages... Please wait.';
  summary.textContent = '';
  showDownloadButton(false);
  lastExtractedLinks = [];

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith('https://www.google.com/search')) {
    status.textContent = 'Please run this on a Google search results page.';
    summary.textContent = '';
    return;
  }

  // Request extraction from background
  chrome.runtime.sendMessage({ type: 'START_EXTRACTION', tabId: tab.id }, (response) => {
    if (chrome.runtime.lastError) {
      status.textContent = 'Could not communicate with background script.';
      summary.textContent = '';
      showDownloadButton(false);
      return;
    }
    if (response && response.links) {
      const links = response.links;
      lastExtractedLinks = links;
      let html = '';
      if (links.length === 0) {
        html = 'No links found.';
        summary.textContent = '';
        showDownloadButton(false);
      } else {
        html = 'Extracted links:<br>' + links.map(l => `<div style=\"word-break:break-all\">${l}</div>`).join('');
        summary.textContent = `Found ${links.length} link${links.length === 1 ? '' : 's'}.`;
        showDownloadButton(true);
      }
      status.innerHTML = html;
    } else if (response && response.status === 'started') {
      status.textContent = 'Extraction started...';
      summary.textContent = '';
      showDownloadButton(false);
    } else {
      status.textContent = 'Extraction failed or returned no data.';
      summary.textContent = '';
      showDownloadButton(false);
    }
  });
}); 