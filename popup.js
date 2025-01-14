document.getElementById('fetch-buttons').addEventListener('click', () => {
  const statusDiv = document.getElementById('status');
  const buttonsContainer = document.getElementById('buttons-container');

  // Show loading indicator
  statusDiv.textContent = 'Loading...';

  // Fetch the buttons from the backend API
  fetch('https://your-repl-url.repl.co/api/buttons')  // Replace with your backend API URL
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Clear previous buttons
      buttonsContainer.innerHTML = '';

      // Display fetched buttons
      data.buttons.forEach(buttonHTML => {
        const buttonElement = document.createElement('div');
        buttonElement.innerHTML = buttonHTML;
        buttonsContainer.appendChild(buttonElement);
      });

      // Clear loading indicator
      statusDiv.textContent = '';
    })
    .catch(error => {
      // Show error message
      statusDiv.textContent = 'Failed to fetch buttons: ' + error.message;
    });
});
