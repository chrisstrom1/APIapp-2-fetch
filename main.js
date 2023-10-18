const API_URL = "https://deckofcardsapi.com/api/deck";
let deckId;

document.getElementById("play-button").addEventListener("click", startGame);

function startGame() {
    // Use the API to create a new deck and shuffle it.
    fetch(`${API_URL}/new/shuffle/?deck_count=1`)
        .then((response) => response.json())
        .then((data) => {
            deckId = data.deck_id;
            drawCards();
        })
        .catch((error) => console.error("Error:", error));
}

function drawCards() {
    // Use the API to draw one card for both the player and the computer.
    fetch(`${API_URL}/${deckId}/draw/?count=2`)
        .then((response) => response.json())
        .then((data) => {
            const playerCard = data.cards[0];
            const computerCard = data.cards[1];

            // Display the cards on the UI.
            document.getElementById("player-card").innerHTML = `
                <img src="${playerCard.image}" alt="${playerCard.value} of ${playerCard.suit}">
            `;
            document.getElementById("computer-card").innerHTML = `
                <img src="${computerCard.image}" alt="${computerCard.value} of ${computerCard.suit}">
            `;

            // Determine the winner and display the result.
            displayResult(playerCard, computerCard);
        })
        .catch((error) => console.error("Error:", error));
}


function getRandomAvatarUrl() {
    const avatarUrls = [
        "avatar1.jpg",
        "avatar2.jpg",
        "avatar3.jpg",
        "avatar4.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * avatarUrls.length);
    return avatarUrls[randomIndex];
}
function displayResult(playerCard, computerCard) {
    // Compare the card ranks to determine the round winner.
    let result = "";

    const playerRank = getCardRank(playerCard.value);
    const computerRank = getCardRank(computerCard.value);

    if (playerRank > computerRank) {
        result = "Player wins this round!";
    } else if (computerRank > playerRank) {
        result = "Computer wins this round!";
    } else {
        result = "It's a tie!";
    }

    // Display the result on the UI.
    document.getElementById("result").textContent = result;
}

function getCardRank(cardValue) {
    // Create a mapping of card values to numerical ranks.
    const rankMap = {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "JACK": 11,
        "QUEEN": 12,
        "KING": 13,
        "ACE": 14
    };

    // Use the rank map to get the numerical rank of the card.
    // Convert the card value to uppercase to handle lowercase values.
    return rankMap[cardValue.toUpperCase()] || 0;
}