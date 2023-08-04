window.addEventListener("DOMContentLoaded", async function() {
    const carousel = document.querySelector(".carousel");
    const projects = await fetch("./resources/projects.json").then(doc => doc.json());
    projects.forEach(project => {
        carousel.appendChild(get_project_card(project));
    });
});



function get_project_card(object) {
    const body = document.querySelector("body");
    const card = document.createElement("div");
    card.classList.add("carousel-card");

    card.innerHTML = `<div class="card-content">
        <div class="card-image"></div>
        <div class="content-wrapper">
            <span class="card-title">${object["name"]}</span>
            <span class="card-location">${object['place']}</span>
        </div>
        <img src="../resources/cursor-icon.svg" class="cursor-pointer" />
    </div>`;

    card.querySelector(".card-image").style.backgroundImage = `url(${object['image-url']})`;

    card.addEventListener("click", function() {
        summon_card_popup(object);
        body.style.overflow = "hidden";
    });

    return card;
}

function summon_card_popup(object) {
    const body = document.querySelector("body");
    const popup = document.createElement("div");
    popup.classList.add("popup-container");

    

    popup.innerHTML = `
        <div class="popup-bg">
        </div>
        <div class="popup-close">
            <span class="material-symbols-outlined">close</span>
        </div>
        <img class="popup-photo" src="${object['image-url']}" />
        `;

    popup.querySelector(".popup-close").addEventListener("click", function() {
        body.removeChild(popup);
        body.style.overflow = "unset";
    });


    body.appendChild(popup);
}