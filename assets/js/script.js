const game = document.querySelector(".game");
const card = document.querySelector(".card");
const vidas = document.querySelector("#vidas");
const nivel = document.querySelector("#nivel");
const menuBox = document.querySelector("#menu-box");
const gameBox = document.querySelector("#game-box");

let stats = 10;
let level = 2;
let deck = [];
let isSurvivalMode = false;
let isNormalMode = false;
let isTimeAttackMode = false;
let timeAttackInterval = null;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(yugiJSON) {
    const randomIndex = Math.floor(Math.random() * yugiJSON.data.length);
    const image =
        yugiJSON.data[Math.min(randomIndex, yugiJSON.data.length - 1)]
            .card_images[0].image_url_small;
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("index", randomIndex);
    newCard.setAttribute("unmatched", true);
    newCard.innerHTML += `<div class="back"></div>`;
    newCard.innerHTML += `<div class="front" style="background-image: url(${image})"></div>`;
    deck.push(newCard);

    //Se agrega la carta "hermana"
    const duplicatedCard = newCard.cloneNode(true);
    deck.push(duplicatedCard);
}

function getActiveCards() {
    return document.querySelectorAll(".card.active[unmatched]");
}

function cardClick(card, yugiJSON) {
    // Si ya se hizo match de esta carta ignorar el click
    const isUnmatched = card.getAttribute("unmatched");
    if (!isUnmatched) return;

    const selectedCards = getActiveCards();
    if (selectedCards.length >= 2) return;
    const isActive = card.classList.contains("active");
    if (isActive) {
        card.classList.remove("active");
    } else {
        card.classList.add("active");
        const updatedSelectedCards = getActiveCards();
        // Si es la segunda carta a seleccionar se verifica si coinciden
        if (updatedSelectedCards.length == 2) {
            setTimeout(() => {
                // Si tienen el mismo atributo Index es porque hacen match y se "sacan" del juego
                if (
                    updatedSelectedCards[0].getAttribute("index") ===
                    updatedSelectedCards[1].getAttribute("index")
                ) {
                    updatedSelectedCards.forEach((card) => {
                        card.removeEventListener("click", cardClick);
                        card.removeAttribute("unmatched");
                        const unmatched =
                            document.querySelectorAll("[unmatched]").length;
                        if (unmatched == 0) {
                            nextLevel(yugiJSON);
                        }
                    });
                    // Si no coinciden se les quita la clase "active"
                } else {
                    updatedSelectedCards.forEach((card) => {
                        card.classList.remove("active");
                    });
                    // restar intentos con else de unmatched
                    stats--;
                    updateScore();
                    if (stats === 0) {
                        gameOver();
                    }
                }
            }, 300);
        }
    }
}

function gameOver() {
    reset();
    stats = 10;
    level = 2;
    updateScore();
    setMenuVisible(true);
}

function nextLevel(yugiJSON) {
    reset();
    level++;
    nivel.innerHTML = `Nivel ${level - 1}`;
    console.log(nivel);
    initGame(yugiJSON);
}
function reset() {
    document.querySelectorAll(".card").forEach((card) => card.remove());
    deck = [];
}

function updateScore() {
    vidas.innerHTML = `${stats} ${
        isTimeAttackMode ? "segundos restantes" : "vidas"
    }`;
    nivel.innerHTML = `Nivel ${level - 1}`;
}

function initGame(yugiJSON) {
    setMenuVisible(false);
    if (isNormalMode) {
        stats = 10;
    }
    updateScore();

    for (let i = 0; i < level; i++) {
        createCard(yugiJSON);
    }
    for (const card of shuffleArray(deck)) {
        game.appendChild(card);
    }

    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => cardClick(card, yugiJSON));
    });
}

function setMenuVisible(visible) {
    if (visible) {
        isNormalMode = false;
        isSurvivalMode = false;
        isTimeAttackMode = false;
        menuBox.classList.remove("d-none");
        gameBox.classList.add("d-none");
    } else {
        menuBox.classList.add("d-none");
        gameBox.classList.remove("d-none");
    }
}

const promiseFetchYugiJSON = fetch("./assets/js/cardinfo.json").then(
    (response) => response.json()
);

function selectGameModeListener(modoDeJuego) {
    switch (modoDeJuego) {
        case "normal":
            isNormalMode = true;
            break;
        case "survival":
            isSurvivalMode = true;
            break;
        default:
            isTimeAttackMode = true;
            break;
    }
    if (isNormalMode) {
        stats = 10;
    }
    if (isSurvivalMode) {
        stats = 100;
    }
    if (isTimeAttackMode) {
        stats = 180;
        timeAttackInterval = setInterval(() => {
            stats--;
            updateScore();
            if (stats <= -1) {
                clearInterval(timeAttackInterval);
                gameOver();
            }
        }, 1000);
    }
    promiseFetchYugiJSON.then((yugiJSON) => initGame(yugiJSON));
}
