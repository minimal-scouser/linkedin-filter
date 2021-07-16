console.log('From background');

const myURLs = ['linkedin.com/feed'];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    myURLs.some((url) => tab.url.includes(url))
  ) {
    chrome.tabs.executeScript(tabId, { file: './filter.js' });
  }
});
