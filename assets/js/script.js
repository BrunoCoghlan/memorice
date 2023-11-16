
const game = document.querySelector(".game");
const card = document.querySelector(".card");
let level = 3;
let deck = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

function createCard(yugiJSON) {
    const randomIndex = Math.floor(Math.random() * yugiJSON.data.length);
    const image = yugiJSON.data[Math.min(randomIndex, yugiJSON.data.length-1)].card_images[0].image_url_small;
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute('index', randomIndex);
    newCard.setAttribute('unmatched', true);
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
                if (updatedSelectedCards[0].getAttribute('index') === updatedSelectedCards[1].getAttribute('index')) {
                    updatedSelectedCards.forEach(card => {
                        card.removeEventListener("click", cardClick);
                        card.removeAttribute("unmatched");
                        const unmatched = document.querySelectorAll('[unmatched]').length;
                        if(unmatched == 0){
                            nextLevel(yugiJSON);
                        }
                    });
                // Si no coinciden se les quita la clase "active"
                } else {
                    updatedSelectedCards.forEach(card => {
                        card.classList.remove("active");
                    })
                }
            }, 300);
        }
    }
}
function nextLevel(yugiJSON){
    reset()
    level++
    initGame(yugiJSON)
}
function reset(){
    document.querySelectorAll('.card').forEach(card => card.remove())
    deck = [];
}
function initGame(yugiJSON) {
    for (let i = 0; i < level; i++) {
        createCard(yugiJSON);
    }
    for (const card of shuffleArray(deck)) {
        game.appendChild(card);
    }

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => cardClick(card, yugiJSON));
    });
}

fetch("./assets/js/cardinfo.json")
.then((response) => response.json())
.then(initGame);
