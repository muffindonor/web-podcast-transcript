const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const fileUpload = document.getElementById('fileUpload');
const fileNameDisplay = document.getElementById('fileName');

const summarizeButton = document.querySelector('button[onclick="summarizeText()"]');
const outputSection = document.querySelector('.p-4.border');

// Toggle theme between dark and light mode
themeToggle.addEventListener('click', () => {
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark');
    themeToggle.textContent = 'Light Mode';
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.classList.add('dark');
    themeToggle.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'dark');
  }
});

// Apply saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme)) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
});

// File upload handler
fileUpload.addEventListener('change', () => {
  const file = fileUpload.files[0];
  fileNameDisplay.textContent = file ? `Uploaded: ${file.name}` : '';
});

// Summarize text handler
function summarizeText() {
  outputSection.innerHTML = `
    <h2 class="font-bold mb-2">Output:</h2>
    <p>This is a placeholder summary for the uploaded file.</p>
  `;
}
summarizeButton.addEventListener('click', summarizeText);


// Adding the setRating function for star rating
function setRating(rating) {
  const stars = document.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    // Check if the index is less than the rating
    if (index < rating) {
      // Apply yellow color for selected stars in both light and dark modes
      star.classList.add('text-yellow-500');
      star.classList.remove('text-gray-300', 'dark:text-gray-500');
    } else {
      // Reset to gray color in light mode and dark gray in dark mode
      star.classList.add('text-gray-300', 'dark:text-gray-500');
      star.classList.remove('text-yellow-500');
    }
  });
}