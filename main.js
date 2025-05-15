const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const h1Element = document.querySelector("h1");
h1Element.dataset.value = h1Element.innerText; // set the original text as data attribute

// Typing animation for the h1 element
function typeOutText(element, text, callback) {
    let currentIndex = 0;
    let typedText = "";

    function type() {
        typedText += text[currentIndex];
        element.innerText = typedText;
        currentIndex++;

        if (currentIndex < text.length) {
            setTimeout(type, 50); // add a 50ms delay between each frame
        } else {
            callback(); // call the callback function when typing is complete
        }
    }

    type();
}

// Random letter animation for the h1 element
function randomLetterAnimation(element) {
    let currentIndex = 0;

    function animate() {
        element.innerText = element.innerText.split("")
            .map((letter, index) => {
                if (currentIndex >= element.dataset.value.length) {
                    return element.dataset.value[index];
                }

                if (index <= currentIndex) {
                    return element.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        currentIndex++;

        if (currentIndex < element.dataset.value.length) {
            setTimeout(animate, 50); // add a 50ms delay between each frame
        }
    }

    animate();
}

// Run the typing and random letter animations for the h1 element
typeOutText(h1Element, h1Element.dataset.value, () => {
    randomLetterAnimation(h1Element);
});

// Event listener for the "Ask" button
document.getElementById('ask-button').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') {
        alert('Please enter a question for Ultron.');
        return;
    }
    document.getElementById('user-input').value = '';  // Clear the input field

    fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = `Ultron: ${data.response}`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'Error: Unable to retrieve response from Ultron.';
    });
});
