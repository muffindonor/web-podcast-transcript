// data.js

// Content database
const contentDatabase = {
    // Header text for the main page
    headerText: "Welcome to the Podcast App",
    // Upload file section text
    uploadText: "Click to upload audio file",
    // About Us section text
    aboutUsText: "Welcome to the Podcast App, your one-stop solution for podcast transcription, summaries, and SEO optimization. Our mission is to make podcast content more accessible and engaging for everyone.",
    // Team members data
    teamMembers: [
      { name: "Bruce Willis", role: "Senior Developer", image: "dev1.jpg" },
      { name: "John Travolta", role: "Senior Developer", image: "dev2.jpg" },
      { name: "Nicolas Cage", role: "Senior Developer", image: "dev3.jpg" },
      { name: "Quentin Tarantino", role: "Developer", image: "dev4.jpg" },
      { name: "Ryan Gosling", role: "Developer", image: "dev5.jpg" },
    ],

    // Rating section HTML
    ratingSection: `
    <div class="mt-8 text-center">
      <h2 class="text-lg mb-2 text-gray-900 dark:text-gray-100">Rate us:</h2>
      <div class="flex justify-center space-x-2 text-xl sm:text-2xl">
        <span class="star text-gray-300 dark:text-gray-500 cursor-pointer" onclick="setRating(1)">☆</span>
        <span class="star text-gray-300 dark:text-gray-500 cursor-pointer" onclick="setRating(2)">☆</span>
        <span class="star text-gray-300 dark:text-gray-500 cursor-pointer" onclick="setRating(3)">☆</span>
        <span class="star text-gray-300 dark:text-gray-500 cursor-pointer" onclick="setRating(4)">☆</span>
        <span class="star text-gray-300 dark:text-gray-500 cursor-pointer" onclick="setRating(5)">☆</span>
      </div>
    </div>
  `,


  };
  
  // Render function to dynamically insert content
  function renderContent() {
    // Set header text
    const headerElement = document.getElementById('headerText');
    if (headerElement) {
      headerElement.innerText = contentDatabase.headerText;
    }
  
    // Set upload file section text
    const uploadTextElement = document.getElementById('uploadText');
    if (uploadTextElement) {
      uploadTextElement.innerText = contentDatabase.uploadText;
    }

    // Set About Us section text
    const aboutUsElement = document.getElementById('aboutUsText');
    if (aboutUsElement) {
      aboutUsElement.innerText = contentDatabase.aboutUsText;
    }

    // Render team members dynamically
    const teamSection = document.getElementById('teamSection');
    if (teamSection) {
      contentDatabase.teamMembers.forEach((member) => {
        const teamMemberHTML = `
          <div class="flex flex-col items-center text-center">
            <img src="${member.image}" alt="${member.name}" class="rounded-full w-32 h-32 object-cover shadow-lg">
            <h3 class="text-xl font-bold mt-4 text-gray-800 dark:text-white">${member.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">${member.role}</p>
          </div>
        `;
        teamSection.innerHTML += teamMemberHTML;
      });
    }

    // Render the rating section dynamically
    const ratingContainer = document.getElementById('ratingSection');
    if (ratingContainer) {
      ratingContainer.innerHTML = contentDatabase.ratingSection;
    }

  }
  
  // Call the render function after the page loads
  window.onload = renderContent;
  
  