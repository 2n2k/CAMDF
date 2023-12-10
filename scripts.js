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
            // Toggle visibility of description and form
            description.style.display = description.style.display === 'block' ? 'none' : 'block';
            form.style.display = description.style.display; // Set form display to match description
        }
    });
});
