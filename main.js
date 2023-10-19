const API_URL = "https://deckofcardsapi.com/api/deck";
let deckId;

// Generate random image URLs for the player and computer avatars
document.getElementById("player-avatar").src = getRandomAvatarUrl();
document.getElementById("computer-avatar").src = getRandomAvatarUrl();

document.getElementById("play-button").addEventListener("click", startGame);

function startGame() {
    createAndShuffleDeck()
        .then(() => drawCards())
        .then((cards) => {
            const playerCard = cards[0];
            const computerCard = cards[1];

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

function createAndShuffleDeck() {
    // Use the API to create a new deck and shuffle it.
    return fetch(`${API_URL}/new/shuffle/?deck_count=1`)
        .then((response) => response.json())
        .then((data) => {
            deckId = data.deck_id;
        });
}

function drawCards() {
    // Use the API to draw one card for both the player and the computer.
    return fetch(`${API_URL}/${deckId}/draw/?count=2`)
        .then((response) => response.json())
        .then((data) => data.cards);
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

function getRandomAvatarUrl() {
    // Generate random avatar URLs for player and computer
    const playerAvatars = [
        "player1.jpg",
        "player2.jpg",
        // Add more avatar URLs as needed
    ];
    const computerAvatars = [
        "computer1.jpg",
        "computer2.jpg",
        // Add more avatar URLs as needed
    ];
    
    const randomPlayerAvatar = playerAvatars[Math.floor(Math.random() * playerAvatars.length)];
    const randomComputerAvatar = computerAvatars[Math.floor(Math.random() * computerAvatars.length)];

    return {
        player: randomPlayerAvatar,
        computer: randomComputerAvatar,
    };
}
