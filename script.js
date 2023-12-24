let folders = null;


window.addEventListener("DOMContentLoaded", async function() {
    folders = await fetch("resources/folder-settings.json").then(doc => doc.json());
})


function wait_for(time) {
    return new Promise(function(resolve) {
        window.setTimeout(function() {
            resolve()
        }, time);
    })
} 


function spawn_slideshow(codename) {
    if(!folders) {
        throw new Error("file not loaded!");
    }
    if(!(codename in folders)) {
        throw new Error("album codename doesn't exist!");
    }

    const photos = folders[codename];
    const images = photos.map(photo => {
        const image = document.createElement("img");
        image.classList.add("popup-image");
        image.src = `resources/photos/${photo}`;
        image.alt = photo;
        return image;
    });

    let cursor = 0;
    const popup_container = document.createElement("div");
    popup_container.classList.add("popup-container");
    popup_container.id = "popup-container";

    const close_button = document.createElement("img");
    close_button.classList.add("popup-close");
    close_button.src = "resources/close.svg";
    close_button.addEventListener("click", function() {
        document.body.removeChild(popup_container);    
    })



    const from_next_to_current_to_left_mov = {
        "outer-left": "left",
        "left": "middle",
        "middle": "right",
        "right": "outer-right"
    };

    const from_next_to_current_to_right_mov = {
        "left": "outer-left",
        "middle": "left",
        "right": "middle",
        "outer-right": "right"
    };

    
    const arrow_prev = document.createElement("img");
    arrow_prev.classList.add("arrow");
    arrow_prev.classList.add("arrow-prev");
    arrow_prev.src = "resources/arrow-prev.svg";
    
    const arrow_next = document.createElement("img");
    arrow_next.classList.add("arrow");
    arrow_next.classList.add("arrow-next");
    arrow_next.src = "resources/arrow-next.svg";
    
    function disable_arrow(arrow, condition) {
        if(condition) arrow.classList.add("disabled");
        else arrow.classList.remove("disabled");
    }

    function check_arrows() {
        disable_arrow(arrow_next, cursor === images.length - 1);
        disable_arrow(arrow_prev, cursor === 0);
    }
    
    async function shift(direction) {
        disable_arrow(arrow_next, true);
        disable_arrow(arrow_prev, true);

        cursor += direction;

        for(let i = 0; i < images.length; i++) {
            const next = (i < cursor - 1) ? "outer-right" : (i === cursor - 1) ? "right" : (i === cursor) ? "middle" : (i === cursor + 1) ? "left" : "outer-left";

            if(images[i].classList.contains(next)) continue;

            const to_remove = (direction < 0) ? from_next_to_current_to_left_mov[next] : from_next_to_current_to_right_mov[next];

            images[i].classList.remove(to_remove);
            images[i].classList.add(next);

        }
    }

    arrow_prev.addEventListener("click", async function() {
        if(this.classList.contains("disabled")) return;
        shift(-1);
        await wait_for(600);
        check_arrows();
    })
    arrow_next.addEventListener("click", async function() {
        if(this.classList.contains("disabled")) return;
        shift(1);
        await wait_for(600);
        check_arrows();
    })

    popup_container.innerHTML = `<div class="popup-bg"></div>`;
    popup_container.appendChild(close_button);
    popup_container.appendChild(arrow_prev);
    popup_container.appendChild(arrow_next);
    

    check_arrows();
    
    for(let i = 0; i < images.length; i++) {
        if(i === 0) {
            images[i].classList.add("middle");
        }else if(i === 1) {
            images[i].classList.add("left");
        }else {
            images[i].classList.add("outer-left");
            images[i].loading = "lazy";
        }

        popup_container.appendChild(images[i]);
    }
    

    document.body.appendChild(popup_container);
}


