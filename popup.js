// popup.js

document.getElementById('fetch-buttons').addEventListener('click', () => {
  // Example action: Open the art webpage
  chrome.tabs.create({ url: 'https://your-repl-url.repl.co/art' });  // Replace with your art page URL
});
