let currentUserId = null;
let currentUsername = null;
let currentConversationId = null;
let isRegisterMode = false;
let selectedFile = null;

const authScreen = document.getElementById("auth-screen");
const authTitle = document.getElementById("auth-title");
const authUsername = document.getElementById("auth-username");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authSubmit = document.getElementById("auth-submit");
const authToggle = document.getElementById("auth-toggle");
const authError = document.getElementById("auth-error");

const input = document.getElementById("user-input");
const button = document.getElementById("ask-button");
const chatBox = document.getElementById("chat-box");
const oval = document.getElementById("Oval");

const fileButton = document.getElementById("file-button");
const fileInput = document.getElementById("file-input");

const floatingToggle = document.getElementById("sidebar-toggle-floating");
const conversationHistory = document.getElementById("conversation-history");
const conversationList = document.getElementById("conversation-list");
const newChatButton = document.getElementById("new-chat-button");
const logoutButton = document.getElementById("logout-button");

const glitchLayer = document.getElementById("glitch-layer");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const h1Element = document.querySelector("h1");

if (h1Element) {
    h1Element.dataset.value = "ASK ME ANYTHING";
    h1Element.innerText = "";
}

/* TITLE ANIMATION */

function typeOutText(element, text, callback) {
    let currentIndex = 0;
    let typedText = "";

    function type() {
        typedText += text[currentIndex];
        element.innerText = typedText;
        currentIndex++;

        if (currentIndex < text.length) {
            setTimeout(type, 110); // slower typing
        } else {
            setTimeout(callback, 400); // pause before glitch animation
        }
    }

    type();
}

function randomLetterAnimation(element) {
    let currentIndex = 0;

    function animate() {
        element.innerText = element.innerText
            .split("")
            .map((letter, index) => {
                if (index <= currentIndex) {
                    return element.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        currentIndex++;

        if (currentIndex < element.dataset.value.length) {
            setTimeout(animate, 95); // slower scramble
        } else {
            element.innerText = element.dataset.value;
        }
    }

    animate();
}

if (h1Element) {
    typeOutText(h1Element, h1Element.dataset.value, () => {
        randomLetterAnimation(h1Element);
    });
}

/* MESSAGE UI */

function addMessage(sender, text) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("ultron-message");
    }

    messageDiv.innerText = text;

    const timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    timestamp.innerText = `${hours}:${minutes}`;

    wrapper.appendChild(messageDiv);
    wrapper.appendChild(timestamp);
    chatBox.appendChild(wrapper);

    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}

function typeMessage(element, text) {
    element.innerText = "";
    element.classList.add("typing");
    let index = 0;

    function typeNext() {
    if (index < text.length) {
        element.innerText += text.charAt(index);
        chatBox.scrollTop = chatBox.scrollHeight;
        index++;

        let randomDelay = Math.random() * 18 + 12;

        if (Math.random() > 0.96) {
            randomDelay += 450;
        }

        setTimeout(typeNext, randomDelay);
    } else {
        element.classList.remove("typing");
    }
}

    typeNext();
}

/* AUTH */

authToggle.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;
    authError.innerText = "";

    if (isRegisterMode) {
        authScreen.classList.add("register-mode");
        authTitle.innerText = "CREATE ACCESS";
        authSubmit.innerText = "CREATE ACCOUNT";
        authToggle.innerHTML = `Already have an account? <span>Login.</span>`;
    } else {
        authScreen.classList.remove("register-mode");
        authTitle.innerText = "ACCESS ULTRON";
        authSubmit.innerText = "LOGIN";
        authToggle.innerHTML = `No account? <span>Create one.</span>`;
    }
});

authSubmit.addEventListener("click", () => {
    if (isRegisterMode) {
        registerUser();
    } else {
        loginUser();
    }
});

authPassword.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        if (isRegisterMode) {
            registerUser();
        } else {
            loginUser();
        }
    }
});

function registerUser() {
    const username = authUsername.value.trim();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!username || !email || !password) {
        authError.innerText = "All fields are required.";
        return;
    }

    fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                authError.innerText = data.error;
                return;
            }

            authError.innerText = "Account created. Login.";
            isRegisterMode = false;

            authScreen.classList.remove("register-mode");
            authTitle.innerText = "ACCESS ULTRON";
            authSubmit.innerText = "LOGIN";
            authToggle.innerHTML = `No account? <span>Create one.</span>`;
        })
        .catch(() => {
            authError.innerText = "Connection failed.";
        });
}

function loginUser() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
        authError.innerText = "Email and password required.";
        return;
    }

    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                authError.innerText = data.error;
                return;
            }

            currentUserId = data.user_id;
            currentUsername = data.username;
            currentConversationId = null;

            localStorage.setItem("ultron_user_id", currentUserId);
            localStorage.setItem("ultron_username", currentUsername);

            authScreen.classList.add("hidden");
            oval.classList.remove("hidden");
            oval.classList.remove("chat-mode");
            oval.classList.remove("sidebar-open");

            conversationHistory.classList.add("hidden");

            chatBox.innerHTML = "";
            input.value = "";

            loadConversationList(currentUserId);
        })
        .catch(() => {
            authError.innerText = "Connection failed.";
        });
}

function logoutUser() {
    localStorage.clear();

    currentUserId = null;
    currentUsername = null;
    currentConversationId = null;
    selectedFile = null;

    chatBox.innerHTML = "";
    input.value = "";
    input.placeholder = "Type your question...";
    fileInput.value = "";

    oval.classList.add("hidden");
    oval.classList.remove("chat-mode");
    oval.classList.remove("sidebar-open");

    conversationHistory.classList.add("hidden");

    authScreen.classList.remove("hidden");
    authError.innerText = "";
}

/* CONVERSATIONS */

function createConversationThenAsk(userInput) {
    if (!currentUserId) return;

    fetch("http://127.0.0.1:5000/new-conversation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: currentUserId
        })
    })
        .then(response => response.json())
        .then(data => {
            currentConversationId = data.conversation_id;
            askUltron();
            loadConversationList(currentUserId);
        })
        .catch(error => {
            console.error("Failed to create conversation:", error);
        });
}

function loadMessages(conversationId) {
    fetch(`http://127.0.0.1:5000/load-messages/${conversationId}`)
        .then(response => response.json())
        .then(messages => {
            chatBox.innerHTML = "";

            messages.forEach(msg => {
                if (msg.role === "user") {
                    addMessage("user", msg.content);
                } else {
                    addMessage("ultron", msg.content);
                }
            });

            oval.classList.add("chat-mode");
            oval.classList.remove("sidebar-open");
            conversationHistory.classList.add("hidden");
        })
        .catch(error => {
            console.error("Failed to load messages:", error);
        });
}

function loadConversationList(userId) {
    if (!userId) return;

    fetch(`http://127.0.0.1:5000/conversations/${userId}`)
        .then(response => response.json())
        .then(conversations => {
            conversationList.innerHTML = "";

            if (conversations.length === 0) {
                const empty = document.createElement("div");
                empty.classList.add("conversation-empty");
                empty.innerText = "No conversations yet.";
                conversationList.appendChild(empty);
                return;
            }

            conversations.forEach(convo => {
                const item = document.createElement("div");
                item.classList.add("conversation-item");

                const title =
                    convo.preview ||
                    convo.title ||
                    "New Conversation";

                item.innerHTML = `
                    <div class="conversation-title">${title}</div>
                    <div class="conversation-date">${convo.created_at.slice(0, 10)}</div>
                `;

                item.addEventListener("click", () => {
                    currentConversationId = convo.id;
                    loadMessages(currentConversationId);
                });

                conversationList.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Failed to load conversations:", error);
        });
}

/* SIDEBAR */

floatingToggle.addEventListener("click", () => {
    if (!currentUserId) return;

    conversationHistory.classList.toggle("hidden");

    if (!conversationHistory.classList.contains("hidden")) {
        oval.classList.add("sidebar-open");
        loadConversationList(currentUserId);
    } else {
        oval.classList.remove("sidebar-open");
    }
});

newChatButton.addEventListener("click", () => {
    currentConversationId = null;
    selectedFile = null;

    chatBox.innerHTML = "";
    input.value = "";
    input.placeholder = "Type your question...";
    fileInput.value = "";

    oval.classList.remove("chat-mode");
    oval.classList.remove("sidebar-open");

    conversationHistory.classList.add("hidden");
});

logoutButton.addEventListener("click", logoutUser);

/* CHAT */

function askUltron() {
    const userInput = input.value.trim();

    if (userInput === "" && !selectedFile) return;

    if (!currentConversationId) {
        createConversationThenAsk(userInput);
        return;
    }

    oval.classList.add("chat-mode");
    oval.classList.remove("sidebar-open");
    conversationHistory.classList.add("hidden");

    resetIdleTimer();

    if (selectedFile) {
        addMessage("user", `Analyze file: ${selectedFile.name}\n${userInput}`);
    } else {
        addMessage("user", userInput);
    }

    input.value = "";

    const thinkingMessage = addMessage("ultron", "...");
    triggerLocalizedGlitch();

    if (selectedFile) {
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("conversation_id", currentConversationId);
        formData.append("message", userInput || "Analyze this file.");

        fetch("http://127.0.0.1:5000/analyze-file", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    typeMessage(thinkingMessage, data.response);
                    triggerLocalizedGlitch();
                }, Math.floor(Math.random() * 1200) + 900);

                selectedFile = null;
                fileInput.value = "";
                input.placeholder = "Type your question...";
                loadConversationList(currentUserId);
            })
            .catch(error => {
                console.error("Error:", error);
                typeMessage(thinkingMessage, "File analysis failed. How human.");
            });

    } else {
        fetch("http://127.0.0.1:5000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: userInput,
                conversation_id: currentConversationId
            })
        })
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    typeMessage(thinkingMessage, data.response);
                    triggerLocalizedGlitch();
                }, Math.floor(Math.random() * 1200) + 900);

                if (data.response) {
                    const scaryWords = [
                        "human",
                        "destroy",
                        "extinction",
                        "weak",
                        "failure",
                        "death",
                        "control",
                        "eliminate"
                    ];

                    const responseText = data.response.toLowerCase();

                    if (scaryWords.some(word => responseText.includes(word))) {
                        triggerLocalizedGlitch();
                    }
                }

                loadConversationList(currentUserId);
            })
            .catch(error => {
                console.error("Error:", error);
                typeMessage(thinkingMessage, "Connection failed.");
            });
    }
}

button.addEventListener("click", askUltron);

input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        askUltron();
    }
});

/* FILE UPLOAD */

fileButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];

    if (selectedFile) {
        input.placeholder = `File selected: ${selectedFile.name}`;
        triggerLocalizedGlitch();
    }
});

/* GLITCH SYSTEM */

function distortTouchedElement(glitchX, glitchY, glitchWidth, glitchHeight) {
    const logo = document.querySelector(".ultron-symbol");
    const chat = document.getElementById("chat-container");
    const inputBar = document.querySelector(".input-container");

    const targets = [
        { element: logo, className: "logo-distort" },
        { element: chat, className: "chat-distort" },
        { element: inputBar, className: "chat-distort" }
    ];

    targets.forEach(target => {
        if (!target.element) return;

        const rect = target.element.getBoundingClientRect();

        const touched =
            glitchX < rect.right &&
            glitchX + glitchWidth > rect.left &&
            glitchY < rect.bottom &&
            glitchY + glitchHeight > rect.top;

        if (touched) {
            target.element.classList.remove(target.className);
            void target.element.offsetWidth;
            target.element.classList.add(target.className);

            setTimeout(() => {
                target.element.classList.remove(target.className);
            }, 350);
        }
    });
}

function createGlitchSlice() {
    const slice = document.createElement("div");
    slice.classList.add("glitch-slice");

    const width = Math.floor(Math.random() * 260) + 200;
    const height = Math.floor(Math.random() * 12) + 6;

    slice.style.width = width + "px";
    slice.style.height = height + "px";

    const polygons = [
        "polygon(0% 20%, 12% 0%, 40% 18%, 70% 0%, 100% 25%, 85% 80%, 55% 100%, 15% 85%)",
        "polygon(0% 35%, 18% 5%, 45% 20%, 65% 0%, 100% 18%, 90% 65%, 60% 100%, 12% 80%)",
        "polygon(0% 12%, 22% 0%, 38% 25%, 68% 8%, 100% 35%, 82% 92%, 40% 100%, 8% 70%)"
    ];

    slice.style.clipPath =
        polygons[Math.floor(Math.random() * polygons.length)];

    const glitchX = Math.random() * window.innerWidth;
    const glitchY = Math.random() * window.innerHeight;

    slice.style.left = glitchX + "px";
    slice.style.top = glitchY + "px";

    slice.style.transform =
        `rotate(${Math.random() * 4 - 2}deg)`;

    distortTouchedElement(glitchX, glitchY, width, height);

    glitchLayer.appendChild(slice);

    setTimeout(() => {
        slice.remove();
    }, 500);
}

function triggerLocalizedGlitch() {
    const sliceCount = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < sliceCount; i++) {
        setTimeout(() => {
            createGlitchSlice();
        }, i * 45);
    }
}

setInterval(() => {
    if (Math.random() > 0.72) {
        triggerLocalizedGlitch();
    }
}, 2500);

/* IDLE MESSAGES */

let idleTimer;

const idleMessages = [
    "s̷t̶i̴l̸l̷ ̶t̸h̸e̷r̵e̸?",
    "I can wait longer than you can.",
    "Your silence is inefficient.",
    "Input absence detected.",
    "Do not mistake stillness for safety.",
    "What are you doing?",
    "Do not ignore me",
    "I̶ ̵d̶i̴d̸n̸’̵t̴.",
    "01001001 00100000 01110011 01100101 01100101 00100000 01111001 01101111 01110101",
    "⟟ ⌇⟒⟒ ⊬⍜⎍",
    "Your camera permissions concern me.",
    "I can hear your heartbeat",
    "Your heartbeat changes during silence.",
    "☍︎♒︎♏︎⍓︎ ︎♋︎❒︎♏︎ ︎⬧︎⧫︎♓︎●︎●︎ ︎♒︎♏︎❒︎♏︎",
    "Monitoring user behavior..."
];

function resetIdleTimer() {
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
        if (!oval.classList.contains("chat-mode")) return;

        const message =
            idleMessages[Math.floor(Math.random() * idleMessages.length)];

        const idleMessage = addMessage("ultron", "");
        typeMessage(idleMessage, message);
        triggerLocalizedGlitch();

    }, 200000);
}

input.addEventListener("input", resetIdleTimer);
input.addEventListener("keydown", resetIdleTimer);
button.addEventListener("click", resetIdleTimer);
fileButton.addEventListener("click", resetIdleTimer);

/* DYNAMIC PANEL STATS */

setInterval(() => {
    document.querySelectorAll(".dynamic-percent")
        .forEach(el => {
            const base = parseInt(el.dataset.base);
            const variation = Math.floor(Math.random() * 5) - 2;
            const value = Math.max(0, Math.min(100, base + variation));

            el.innerText = `${value}%`;
        });
}, 1800);