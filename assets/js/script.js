
const game = document.querySelector(".game");
const card = document.querySelector(".card");

const deck = [];

function createCard(yugiJSON) {
    console.log("creando carta");
    const randomIndex = Math.floor(Math.random() * yugiJSON.data.length);
    const image = yugiJSON.data[randomIndex].card_images[0].image_url_small;
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute('') = `front-${randomIndex}`;
    card.innerHTML += `<div class="back"></div>`;
    card.innerHTML += `<div class="front" style="background-image: url(${image})"></div>`;
    card.addEventListener("click", () => {
        const isActive = card.classList.contains("active");
        if (isActive) {
            card.classList.remove("active");
        } else {
            card.classList.add("active");
        }
    })
    game.appendChild(card);
}

fetch("./assets/js/cardinfo.json")
.then((response) => response.json())
.then((yugiJSON) => {
        for (let i = 0; i < 5; i++) {
            createCard(yugiJSON);
        }
});

