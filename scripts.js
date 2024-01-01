const correctFlags = {
  challenge_1: 'b590744c258f76db8761a02d0b2bc92c0be714a1a936b2e800d85343ac8403d1',
  challenge_2: 'affe82e560badcfdc190801fbbd5599cb824d08733ea9a525bae6e06462d10e9',
  challenge_3: '2d352e27eee201b938a9eb6d4e96dec96622e27ea6e3a89f028445cf1657d64a',
  challenge_4: '12a650c679813a0c23c166a6d5839ae63c3452c8c11d0aadb80c8b3dc1b783b2',
  challenge_5: 'be2ed2f98ad0cc0d15411ee773d50c7f159295f489d1f5a37164c39cb711bbad',
  challenge_6: 'e8a7c61e5ddf23214b7a6a4a839766a85574921a0ed90e6302621f098db9e9d7',
  challenge_7: '0017d212771d8e490e12f5c4a0a9b09eb4d712ce81771a83387d103e52f7fca0',
  challenge_8: '2bec64773383d1b6c6578ef208d81020b477806c997f8af1990a288eda9caeec',
  challenge_9: 'e6ac4cc64d7c05cbf29689c971120e2225d5cd571e6d09646653bc061ef36a46',
  challenge_10: '5b95f7b241ca578fec849283e1137ffa76ad35ff4cce0d390fbcc029936857ff'
};

const redHerrings = {
  herring_1: '551e1743f2aedbdf3445f5ca6cce284cdcec7180297ed12fdfafe569e3e26034',
  herring_2: 'cadfedcfec000fe2586907ae7615353b23bc1b93f0bc2e6fed84107ed5ed8e24',
  herring_3: '14f105246ac823035982934644ce744483e522757ee9487f567425a20d0964e3'
};

let submittedCorrectFlags = JSON.parse(localStorage.getItem('submittedFlags')) || {};
let allChallengesSolved = false;

// Function to encrypt input
async function sha256(input) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Function to check if all challenges are solved
function checkAllChallengesSolved() {
  const totalChallenges = 10;
  let solvedCount = 0;

  submittedCorrectFlags = JSON.parse(localStorage.getItem('submittedFlags')) || {};
  for (const key in submittedCorrectFlags) {
    submittedCorrectFlags[key] = !!submittedCorrectFlags[key]; // Convert to boolean
    if (submittedCorrectFlags[key] === true) {
      solvedCount++;
  }
}

  if (solvedCount === totalChallenges && !allChallengesSolved) {
    allChallengesSolved = true;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('All challenges are solved!');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    const finish = document.getElementById('finish-submit');
    finish.style.display = 'block';
  } else if (allChallengesSolved){
    console.log('Blocking allChallengesSolved from being called again');
  } else {
    console.log('------------------------------------------');
    console.log('Not all challenges are solved yet.');
    console.log('total challenges: ' + totalChallenges);
    console.log('solved count: ' + solvedCount);
    console.log('------------------------------------------');
  }
}

// Function to load submitted flags
function loadSubmittedFlagsFromLocalStorage(callback) {
  submittedCorrectFlags = JSON.parse(localStorage.getItem('submittedFlags')) || {};
  for (const key in submittedCorrectFlags) {
    submittedCorrectFlags[key] = !!submittedCorrectFlags[key];
  }

  callback();
}



// Load submitted flags and then check if all challenges are solved
console.log('Performing check upon loading submitted flags from local storage');
loadSubmittedFlagsFromLocalStorage(checkAllChallengesSolved);

// Check if all challenges are solved on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSubmittedFlagsFromLocalStorage(() => {
    console.log('Performing check upon loading page')
    checkAllChallengesSolved();
  });
  // Initialize EmailJS
  emailjs.init('5WVH_sGj81sU7LxoB');
  console.log('No comments should be here. If you see this or any other text in the console, remind me or Matas to delete it lmaooooo')
});

// Function to handle form submission
async function submitFlag(challengeId, item, clickHandler) {
  const successMessage = document.querySelector(`[data-challenge="${challengeId}"] .success-message`);
  const form = document.querySelector(`[data-challenge="${challengeId}"] .flag-form`);
  const submitButton = document.querySelector(`[data-challenge="${challengeId}"] .flag-form button`);

  const flagInput = document.getElementById(`flag-${challengeId}`);
  const submittedFlag = flagInput.value;

  // Encrypt submitted flag
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
      // Storing the answered flag
      localStorage.setItem('submittedFlags', JSON.stringify(submittedCorrectFlags));


      // Disabling further interaction with the challenge
      item.removeEventListener('click', clickHandler);
      submitButton.disabled = true;

      // Check all challenges solved only after a flag is submitted
      const flagSubmition = Object.values(submittedCorrectFlags).every(flag => flag);
      if (flagSubmition) {
        console.log('Checking if all challenges were solved after a flag is submitted');
        checkAllChallengesSolved();
      }
    } else {
      alert('Sorry, the flag is not correct. Please try again.');
    }
  }
}

document.querySelectorAll('.challenge-item').forEach(item => {
  const difficulty = item.querySelector('h3').innerText.split('(')[1].split(')')[0].toLowerCase();

  switch (difficulty) {
    case 'easy':
      item.querySelector('h3').style.color = 'green';
      item.style.backgroundColor = 'rgba(20, 100, 40, 0.3)';
      item.querySelector('.description p').style.color = 'darkseagreen'
      break;
    case 'medium':
      item.querySelector('h3').style.color = 'goldenrod';
      item.style.backgroundColor = 'rgba(236, 196, 63, 0.2)';
      item.querySelector('.description p').style.color = 'khaki'
      break;
    case 'hard':
      item.querySelector('h3').style.color = 'crimson';
      item.style.backgroundColor = 'rgba(210, 41, 52, 0.2)';
      item.querySelector('.description p').style.color = 'indianred'
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

  const clickHandler = (event) => {
    const clickedElement = event.target;
    const isChallengeName = clickedElement.closest('.challenge-item') === item && clickedElement.tagName === 'H3';

    if (isChallengeName && !success) {
      const isOpen = description.style.display === 'block';
      hideOtherChallenges();

      if (isOpen) {
        description.style.display = 'none';
        form.style.display = 'none';
        successMessage.style.display = submittedCorrectFlags[challengeId] ? 'block' : 'none';
      } else {
        description.style.display = 'block';
        form.style.display = 'block';
        successMessage.style.display = 'none';
      }
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

      // Store the success state
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


// Everything that includes EmailJS

// Function to handle form submission
function handleFormSubmission(event) {
  event.preventDefault();

  var registeredName = localStorage.getItem('registeredName');
  var alreadyRegistered = localStorage.getItem('registered');

  if (alreadyRegistered) {
    alert(`You have already been registered in our winners database by the name: ${registeredName}`);
    return;
  }

  const btn = document.getElementById('button');
  btn.value = 'Sending...';

  const serviceID = 'default_service';
  const templateID = 'template_q6t1wy6';

  // Create a new Date object to get the current time
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var formattedTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);

  // Set the current time to the currentTime element and hidden input field
  document.getElementById('currentTime').textContent = 'Submission time: ' + formattedTime;
  document.getElementById('submissionTime').value = formattedTime;

  // Function to validate the user's name input
  function validateUserName() {
    const nameInput = document.getElementById('userName');

    const nameRegEx = /^[a-zA-Z0-9_\.]{1,50}$/;

    if (!nameRegEx.test(this.value)) {
      alert('Invalid username format. Please enter a valid username with up to 50 characters, including alphanumeric characters, underscores, and periods.');
      this.value = '';
      return false; // Prevent email from being sent
    } else {
      return true; // Allow email to be sent
    }
  }

  // Call the function to limit characters in the input field
  limitCharacters();
  validateUserName();
  // Send the form using EmailJS
  // Validate the user's name
    if (validateUserName()) {
      // Username is valid, proceed with sending the email
      emailjs.sendForm(serviceID, templateID, event.target)
        .then(() => {
          btn.value = 'Send Email';
          alert('Success! You are now in our winners database');
          localStorage.setItem('registered', true);
          // Store the user's name
          localStorage.setItem('registeredName', document.getElementById('userName').value);
        })
        .catch((err) => {
          btn.value = 'Send Email';
          alert(JSON.stringify(err));
        });
    } else {
      // Username is invalid, do not send the email
      alert('Please enter a valid username before submitting the form.');
    }
  }

// Function to update the current time immediately when the page loads
function updateTime() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var formattedTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
  document.getElementById('currentTime').textContent = 'Submission time: ' + formattedTime;
}

// Function to limit the number of characters in the input field
function limitCharacters() {
  const inputField = document.getElementById('userName');
  const maxLength = 50; // Maximum allowed characters

  inputField.addEventListener('input', function(event) {
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength); // Truncate the input
    }
  });
}

updateTime(); // Update immediately
setInterval(updateTime, 1000); // Update every second

// Add event listener to the form
document.getElementById('finish').addEventListener('submit', handleFormSubmission);


// Call the function to limit characters in the input field
limitCharacters();
