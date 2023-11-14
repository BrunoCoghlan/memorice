
const game = document.querySelector(".game");
const card = document.querySelector(".card");

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const deck = [];

function createCard(yugiJSON, i) {
    const randomIndex = Math.floor(Math.random() * yugiJSON.data.length);
    const image = yugiJSON.data[randomIndex].card_images[0].image_url_small;
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("not-matched");
    card.setAttribute('index', randomIndex);
    card.innerHTML += `<div class="back"></div>`;
    card.innerHTML += `<div class="front" style="background-image: url(${image})"></div>`;
    deck.push(card);
    const duplicatedCard = card.cloneNode(true);
    deck.push(duplicatedCard);
}

fetch("./assets/js/cardinfo.json")
.then((response) => response.json())
.then((yugiJSON) => {
    for (let i = 0; i < 5; i++) {
        createCard(yugiJSON, i);
    }
    for (const card of shuffle(deck)) {
        game.appendChild(card);
    }

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function cardClick() {
            const selectedCards = document.querySelectorAll(".card.active.not-matched");
            if (selectedCards.length >= 2) return;
            const isActive = card.classList.contains("active");
            if (isActive) {
                card.classList.remove("active");
            } else {
                card.classList.add("active");
                const updatedSelectedCards = document.querySelectorAll(".card.active.not-matched");
                if (updatedSelectedCards.length == 2) {
                    setTimeout(() => {
                        if (updatedSelectedCards[0].getAttribute('index') === updatedSelectedCards[1].getAttribute('index')) {
                            updatedSelectedCards.forEach(card => {
                                card.removeEventListener("click", cardClick);
                                card.classList.remove("not-matched");
                            });
                        } else {
                            updatedSelectedCards.forEach(card => {
                                card.classList.remove("active");
                            })
                        }
                    }, 300);
                }
            }
        });
    });
});

