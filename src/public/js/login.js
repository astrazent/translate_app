const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const registerSubmit = document.getElementById("registerSubmit");
const loginSubmit = document.getElementById("loginSubmit");

//alert
let notifications = document.querySelector(".notifications");

//login js
const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");

inputs.forEach((inp) => {
    inp.addEventListener("focus", () => {
        inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
        if (inp.value != "") return;
        inp.classList.remove("active");
    });
});

toggle_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
        main.classList.toggle("sign-up-mode");
    });
});

// ============================= swiper =============================
var swiper = new Swiper(".mySwiper", {
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    slidesPerView: 1,
    lazyloading: true,
    loop: true,
});

//api
registerSubmit.addEventListener("click", () => {
    const register = {
        registerName: registerName.value,
        registerEmail: registerEmail.value,
        registerPassword: registerPassword.value,
    };
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == "error") {
                let text = data.message;
                error(text);
            } else {
                let text = data.message;
                success(text);
            }
        });
});


loginSubmit.addEventListener("click", () => {
    const login = {
        loginEmail: loginEmail.value,
        loginPassword: loginPassword.value,                                                                                          
    };
    fetch("/api/check-login", {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == "error") {
                let a = 1;
                let text = data.message;
                error(text);
            } else {
                window.location.href = "/";
            }
        });
});

//alert
function createToast(type, icon, title, text) {
    let newToast = document.createElement("div");
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="content">
                <div class="title">${title}</div>
                <span class="content_text">${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
        </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(() => newToast.remove(), 5000);
}
function success(text) {
    let type = "success";
    let icon = "fa-solid fa-circle-check";
    let title = "Success";
    createToast(type, icon, title, text);
}
function error(text) {
    let type = "error";
    let icon = "fa-solid fa-circle-exclamation";
    let title = "Oops";
    createToast(type, icon, title, text);
}

