// Define the correct flag hashes for each challenge (replace with your actual hashes)
const correctFlags = {
  challenge_1: 'b590744c258f76db8761a02d0b2bc92c0be714a1a936b2e800d85343ac8403d1',
  challenge_2: '1b498251cd9384705ee1aea6c17b49d873f10be0b6f4c08c068a2a576a0a58c8',
  challenge_3: '2d352e27eee201b938a9eb6d4e96dec96622e27ea6e3a89f028445cf1657d64a'
  // Add more challenges and their respective flag hashes as needed
};

// Function to encrypt input using SHA256
async function sha256(input) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Function to handle form submission
async function submitFlag(challengeId) {
  const flagInput = document.getElementById(`flag-${challengeId}`);
  const submittedFlag = flagInput.value;

  // Encrypt submitted flag using SHA256
  const hashedFlag = await sha256(submittedFlag);

  // Check if the hashed input matches the correct flag hash for the current challenge
  if (hashedFlag === correctFlags[`challenge_${challengeId}`]) {
    alert('Congratulations! The flag is correct.');
    // Here you can perform actions for correct flag submission for this challenge
  } else {
    alert('Sorry, the flag is not correct. Please try again.');
    // Here you can handle incorrect flag submission
  }
}

document.querySelectorAll('.challenge-item').forEach(item => {
  // Extract the difficulty from the challenge header
  const difficulty = item.querySelector('h3').innerText.split('(')[1].split(')')[0].toLowerCase();

  // Update the text color based on difficulty
  switch (difficulty) {
    case 'easy':
      item.querySelector('h3').style.color = 'green'; // Change color for Easy difficulty
      break;
    case 'medium':
      item.querySelector('h3').style.color = 'yellow'; // Change color for Medium difficulty
      break;
    case 'hard':
      item.querySelector('h3').style.color = 'red'; // Change color for Hard difficulty
      break;
    default:
      break;
  }

  item.addEventListener('click', (event) => {
    const description = item.querySelector('.description');
    const form = item.querySelector('.flag-form');

    // Check if the clicked target is not inside the form or description
    if (!form.contains(event.target) && !description.contains(event.target)) {
    // Close all open challenges except the one clicked
    document.querySelectorAll('.challenge-item').forEach(challenge => {
      const desc = challenge.querySelector('.description');
      const frm = challenge.querySelector('.flag-form');
      if (challenge !== item) {
        desc.style.display = 'none';
        frm.style.display = 'none';
      }
    });

    // Toggle visibility of description and form for the clicked challenge
    description.style.display = description.style.display === 'block' ? 'none' : 'block';
    form.style.display = description.style.display; // Set form display to match description
  }
});

  // Attach submitFlag function to each submit button click
  const submitButton = item.querySelector('.flag-form button');
  submitButton.addEventListener('click', (event) => {
    const challengeId = item.getAttribute('data-challenge');
    submitFlag(challengeId);
  });
});
