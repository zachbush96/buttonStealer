(function() {
  // Function to select all buttons
  function getAllButtons() {
    return Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'))
      .filter(isEligibleButton);  // Filter only eligible buttons
  }

  // Check if a button is visible, has text content, or contains images
  function isEligibleButton(button) {
    const rect = button.getBoundingClientRect();

    // Check if the button is visible on the page
    const isVisible = rect.width > 0 && rect.height > 0 &&
                      rect.top >= 0 && rect.left >= 0 &&
                      rect.bottom <= window.innerHeight && rect.right <= window.innerWidth &&
                      button.style.display !== 'none' && button.style.visibility !== 'hidden' &&
                      button.style.opacity !== '0';

    // Check if button has non-whitespace text content
    const hasTextContent = button.textContent.trim().length > 0;

    // Check if button contains images (like <img> or <svg> elements)
    const hasImageContent = button.querySelector('img') !== null || button.querySelector('svg') !== null;

    // Filter the button only if it has visible content (either text or images)
    return isVisible && (hasTextContent || hasImageContent);
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
    .container {padding: 10px; margin: 10px; display: inline-block; }
  </style>
</head>
<body>
  ${createHTML() || ''}
</body>
</html>`;

    console.log('Scraped HTML:', html);

    // Send the HTML to the backend API
    fetch('https://7907ebc7-588d-4842-997e-6ffd8a504f9b-00-2ztv2wnvxa3bt.kirk.replit.dev/api/buttons', {  // Replace with your Replit URL
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
