/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close'),
    header = document.getElementById('header')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}
// ==================== NAV MENU =======================
var headerHeight = document.querySelector(".header").offsetHeight;
var verticalMenu = document.querySelector(".vertical-menu");
var avatar = document.querySelector(".circle");

if(verticalMenu){
    const avaMenu = () => {
        var containerHeaderWidth = document.querySelector(".container").offsetWidth;
        verticalMenu.style.top = headerHeight + "px";
        verticalMenu.style.right = (window.innerWidth - containerHeaderWidth) / 2 + "px";
    }
    avaMenu();
    window.addEventListener('resize', () => {
        avaMenu();
    })
    window.addEventListener('scroll', () => {
        verticalMenu.style.display = 'none';
        menuON = true;
    })
    var menuON = true;
    avatar.addEventListener('click', () => {
        if(menuON){
            console.log("check");
            verticalMenu.style.display = 'block';
            menuON = false;
        }
        else{
            verticalMenu.style.display = 'none';
            menuON = true;
        }
    })
}
/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// ==================== COMMUNITY SWIPER ==========================
var swiper = new Swiper(".mySwiper", {
    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },
    spaceBetween: 20, 
    slidesPerView: 1,
    lazyloading: true,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        992:{
            slidesPerView: 3,
            spaceBetween: 30
        } 
        
    }
});

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 460 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 460) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '150px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.item3, .box2-item3, .box3-item3, .box4-item3`,{interval: 100})
sr.reveal(`.box5`,{origin: 'left'})
sr.reveal(`.box6-item2`,{origin: 'bottom'})
sr.reveal(`.footer__content`,{interval: 100, origin: 'top'})


// ==================== PLAY PAUSE BUTTON ==============================
var video = document.querySelector(".video");
var playText = document.querySelector(".play_text");
var playButton = document.getElementById("play_button");
var playIcon = document.getElementById("play_icon");

playButton.addEventListener("click", function() {
    if (video.paused == true) {
    // Play the video
    video.play();

    // Update the button text to 'Pause'
    playText.innerHTML = "Pause video";

    // Update icon
    playIcon.classList.remove("ri-play-fill");
    playIcon.classList.add("ri-pause-line");
    } else {
    // Pause the video
    video.pause();

    // Update the button text to 'Play'
    playText.innerHTML = "Play video";

    // Update icon
    playIcon.classList.remove("ri-pause-line");
    playIcon.classList.add("ri-play-fill");
}
});

// ===================== VIDEO TEXT HOVER =====================================
var videoText = document.querySelector(".hoverText");
videoText.addEventListener("mouseenter", async () => {
    videoText.style.color = '#3c87c9';
    await setTimeout(function() {
        videoText.style.color = '#ffffff';
    }, 10000);
})

// ==========================  DETECT CHROME USER ============================
// please note, 
// that IE11 now returns undefined again for window.chrome
// and new Opera 30 outputs true for window.chrome
// but needs to check if window.opr is not undefined
// and new IE Edge outputs to true now for window.chrome
// and if not iOS Chrome check
// so use the below updated condition
var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");
var imageVideo = document.querySelector(".image-video");
if (isIOSChrome) {
    // is Google Chrome on IOS
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(width < 576){
        setTimeout(() => {
            alert("nếu bạn đang dùng chrome trên iphone, xin hãy đổi sang trình duyệt safari để có được trải nghiệm tốt nhất")
        }, 5000)
    }
} else if(
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
) {
   // is Google Chrome
} else { 
   // not Google Chrome 
}



// ================================== COUNT VISITED ===================================

let value = document.querySelector(".box5-item2_content");

let startValue = 57855;
let duration =  Math.floor(Math.random() * 10) * 250;

let counter = setInterval(function () {
    let randomValue = Math.random();
    let direction = randomValue <= 0.5 ? -1 : 1; // Xác định hướng tăng (+1) hoặc giảm (-1)
    startValue += direction * Math.floor(randomValue * 10); // Tạo ra một số ngẫu nhiên từ 1 đến 10
    duration = duration / (direction * 1.5);
    value.textContent = startValue;
    if(value.textContent == 87865){
        clearInterval(counter);
    }
}, duration);


// ================================= CHANGE TEXT FOOTER ===============================

//shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Chọn một phần tử ngẫu nhiên từ phần tử chưa được xáo trộn
      [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí giữa phần tử hiện tại và phần tử đã được chọn ngẫu nhiên
    }
    return array; // Trả về mảng đã được xáo trộn
}


//footer text animation
var changeText = document.querySelector(".change-text");
changeText.style.color = "#5551FF";
const arr_text_shuffle = ["translating", "learning", "practicing", "traveling"];
const arr_text = shuffleArray(arr_text_shuffle);

var index = 0;
// Thiết lập hàm để thay đổi nội dung của phần tử mỗi 3 giây
setInterval(function() {
    changeText.style.opacity = "0";

    setTimeout(() =>{
        changeText.textContent = arr_text[index];
        if(index == 0){
            changeText.style.color = "#FFFFFF";
        }
        if(index == 1){
            changeText.style.color = "#0FA958";
        }
        else if(index == 2){
            changeText.style.color = "#5551FF";
        }
        else if(index == 3){
            changeText.style.color = "#C7B9FF";
        }
        index++;
        if (index === 4) {
            index = 0;
        }
        changeText.style.opacity = "1";
    }, 200);
}, 2500); // 3000 milliseconds = 3 seconds




// ============================== CHANGE TEXT VIDEO ===============================

//video text animation
var changeAnimation = document.querySelector(".video_animation");
const animation_text_shuffle = ["future.", "work."];
const animation_text = shuffleArray(animation_text_shuffle);
var index2 = 0;
// Thiết lập hàm để thay đổi nội dung của phần tử mỗi 3 giây
var loop = setInterval(function() {
    changeAnimation.style.opacity = "0";

    setTimeout(() =>{
        changeAnimation.textContent = animation_text[index2];
        changeAnimation.style.opacity = "1";
        index2++;
    }, 200);
    if (index2 == 1) {
        clearInterval(loop);
    }
}, 2000); // 3000 milliseconds = 3 seconds

