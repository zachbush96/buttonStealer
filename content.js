// content.js

(function() {
  // Function to select all buttons
  function getAllButtons() {
    return Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'));
  }

  // Function to get computed styles
  function getStyles(el) {
    if (!el) return '';
    const styles = window.getComputedStyle(el);
    return Array.from(styles).map(key => `${key}: ${styles.getPropertyValue(key)};`).join(' ');
  }

  // Function to clone the button element
  function cloneElement(el) {
    if (!el || !el.tagName) return null;
    const tagName = el.tagName.toLowerCase();
    const cloned = document.createElement(tagName);
    cloned.style.cssText = getStyles(el);

    if (tagName === 'svg') {
      cloned.innerHTML = el.innerHTML;
    } else {
      el.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          cloned.appendChild(document.createTextNode(child.textContent));
        } else {
          const childClone = cloneElement(child);
          if (childClone) cloned.appendChild(childClone);
        }
      });
    }

    return cloned;
  }

  // Function to create HTML representation
  function createHTML() {
    const buttons = getAllButtons();
    if (buttons.length === 0) return null;

    const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
    const buttonClone = cloneElement(randomButton);

    if (!buttonClone) return null;

    const container = document.createElement('div');
    container.className = 'container';
    container.style.width = getStyles(randomButton).match(/width:\s*[^;]+;/i)?.[0] || 'auto';
    container.style.height = getStyles(randomButton).match(/height:\s*[^;]+;/i)?.[0] || 'auto';
    container.style.display = 'inline-block';
    container.style.border = '2px solid red';
    container.style.padding = '10px';
    container.style.margin = '10px';

    container.appendChild(buttonClone);

    // Serialize the container's outerHTML
    return container.outerHTML;
  }

  // Main execution
  try {
    const html = `<html>
<head>
  <style>
    body { display: flex; flex-wrap: wrap; }
    .container { border: 2px solid red; padding: 10px; margin: 10px; display: inline-block; }
  </style>
</head>
<body>
  ${createHTML() || ''}
</body>
</html>`;

    console.log('Scraped HTML:', html);

    // Send the HTML to the backend API
    fetch('https://your-repl-url.repl.co/api/buttons', {  // Replace with your Replit URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html })
    })
    .then(response => {
      if (!response.ok) {
        console.error('Failed to send button data:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error sending button data:', error);
    });

  } catch (error) {
    console.error('Error in content script:', error);
  }
})();
