// Define the correct flag hashes for each challenge (replace with your actual hashes)
const correctFlags = {
  challenge_1: 'b590744c258f76db8761a02d0b2bc92c0be714a1a936b2e800d85343ac8403d1',
  challenge_2: '1b498251cd9384705ee1aea6c17b49d873f10be0b6f4c08c068a2a576a0a58c8',
  challenge_3: '2d352e27eee201b938a9eb6d4e96dec96622e27ea6e3a89f028445cf1657d64a'
  // Add more challenges and their respective flag hashes as needed
};

const redHerrings = {
  herring_1: '551e1743f2aedbdf3445f5ca6cce284cdcec7180297ed12fdfafe569e3e26034'
};

const submittedCorrectFlags = JSON.parse(localStorage.getItem('submittedFlags')) || {};

// Function to encrypt input using SHA256
async function sha256(input) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Function to handle form submission
async function submitFlag(challengeId, item, clickHandler) {
  const successMessage = document.querySelector(`[data-challenge="${challengeId}"] .success-message`);
  const form = document.querySelector(`[data-challenge="${challengeId}"] .flag-form`);
  const submitButton = document.querySelector(`[data-challenge="${challengeId}"] .flag-form button`);

  const flagInput = document.getElementById(`flag-${challengeId}`);
  const submittedFlag = flagInput.value;

  // Encrypt submitted flag using SHA256
  const hashedFlag = await sha256(submittedFlag);

  if (Object.values(redHerrings).includes(hashedFlag)) {
    alert('You have found a red herring! Keep looking...');
  } else {
    // Check if the hashed input matches the correct flag hash for the current challenge
    if (hashedFlag === correctFlags[`challenge_${challengeId}`]) {
      form.style.display = 'none';
      successMessage.style.display = 'block';

      // Mark the correct flag as submitted for this challenge
      submittedCorrectFlags[challengeId] = true;
      localStorage.setItem('submittedFlags', JSON.stringify(submittedCorrectFlags));

      // Disabling further interaction with the challenge
      item.removeEventListener('click', clickHandler);
      submitButton.disabled = true;
    } else {
      alert('Sorry, the flag is not correct. Please try again.');
      // Here you can handle incorrect flag submission
    }
  }
}

document.querySelectorAll('.challenge-item').forEach(item => {
  const difficulty = item.querySelector('h3').innerText.split('(')[1].split(')')[0].toLowerCase();

  switch (difficulty) {
    case 'easy':
      item.querySelector('h3').style.color = 'green';
      break;
    case 'medium':
      item.querySelector('h3').style.color = 'yellow';
      break;
    case 'hard':
      item.querySelector('h3').style.color = 'red';
      break;
    default:
      break;
  }

  const description = item.querySelector('.description');
  const form = item.querySelector('.flag-form');
  const successMessage = item.querySelector('.success-message');
  const challengeId = item.getAttribute('data-challenge');
  const success = submittedCorrectFlags[challengeId];

  const hideOtherChallenges = () => {
    document.querySelectorAll('.challenge-item').forEach(challenge => {
      const desc = challenge.querySelector('.description');
      const frm = challenge.querySelector('.flag-form');
      const sccs = challenge.querySelector('.success-message');
      if (challenge !== item) {
        desc.style.display = 'none';
        frm.style.display = 'none';
        sccs.style.display = submittedCorrectFlags[challenge.getAttribute('data-challenge')] ? 'block' : 'none';
      }
    });
  };

  const clickHandler = () => {
    if (!success) {
      hideOtherChallenges();
      description.style.display = 'block';
      form.style.display = 'block';
      successMessage.style.display = 'none';
    }
  };

  item.addEventListener('click', clickHandler);

  const submitButton = item.querySelector('.flag-form button');
  submitButton.addEventListener('click', async () => {
    await submitFlag(challengeId, item, clickHandler);

    if (submittedCorrectFlags[challengeId]) {
      hideOtherChallenges();
      successMessage.style.display = 'block';
      form.style.display = 'none';
      description.style.display = 'none';

      // Disabling further interaction with the challenge after submission
      item.removeEventListener('click', clickHandler);
      submitButton.disabled = true;

      // Store the success state in localStorage
      submittedCorrectFlags[challengeId] = true;
      localStorage.setItem('submittedFlags', JSON.stringify(submittedCorrectFlags));
    }
  });

  // Check if the challenge has been previously solved and show the success message
  if (success) {
    hideOtherChallenges();
    successMessage.style.display = 'block';
    form.style.display = 'none';
    description.style.display = 'none';

    item.removeEventListener('click', clickHandler);
    submitButton.disabled = true;
  }
});
