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


/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


// ==================== FLASH CARD =============================
var flipCard = document.querySelector(".flip-card");
var flipCardInner = document.querySelector(".flip-card-inner");
var angle = 180;
flipCard.addEventListener('click', () =>{
    flipCardInner.style.transform = 'rotateX(' + angle + 'deg)';
    angle += 180;
})


// ======================== SHOW POPUP ==================
var togglebtn = document.querySelector('.toggle-btn1');
var togglebtn2 = document.querySelector('.toggle-btn2');
var popupAdd = document.querySelector('.popup_add');
var popupClose = document.querySelector('.popup_close');
var popupOverlay = document.querySelector('.popup_overlay');
var termInput = document.querySelector('.termInput');
var termName = document.querySelector('.termName');
var termTitle = document.querySelector('.termTitle');

// ======
var termDef = document.querySelector('.termDef');
var termDefHDcontent = document.querySelector('.termDef_header-content');
var popupContent = document.querySelector('.popup_content');
var termDefWrap = document.querySelector('.termDefWrap');

var popupMore = document.querySelector('.popup_more');

togglebtn.addEventListener('click', () => {
    popupAdd.style.display = "block";
    popupOverlay.style.display = "block";
    document.body.style.overflow = 'hidden';
})

popupClose.addEventListener('click', () =>{
    popupAdd.style.display = "none";
    popupOverlay.style.display = "none";
    document.body.style.overflow = 'auto';
})

// Sử dụng sự kiện 'input' để kiểm tra khi người dùng nhập vào trường input
termInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        termName.style.display = 'block';
        termTitle.style.display = "block";
    } else {
        termName.style.display = 'flex';
        termTitle.style.display = "none";
    }
});
termInput.addEventListener('focus', function() {
    termName.classList.add("active");
});
termInput.addEventListener('blur', function() {
    termName.classList.remove("active");
});

var deleteTermFunc = () => {
    var deleteTerm = document.querySelectorAll('.deleteTerm');
    deleteTerm.forEach((item) => {
        item.addEventListener('click', () => {
            console.log(deleteTerm);
            if(deleteTerm.length > 2){
                item.parentNode.parentNode.remove();
                updateNumber();
            }
        })
    })
}

var updateNumber = () => {
    var num = 1;
    var numberList = document.querySelectorAll(".termDef_header-content");
    numberList.forEach((item) => {
        item.textContent = num;
        num++;
        count = num;
    })
}

var cloneTermDef = termDef.cloneNode(true);
cloneTermDef.querySelector(".termDef_header-content").textContent = 2;
termDefWrap.appendChild(cloneTermDef);
var count = 3;

popupMore.addEventListener('click', () => {
    var cloneTermDef = termDef.cloneNode(true);
    cloneTermDef.querySelector(".termDef_header-content").textContent = count;
    termDefWrap.appendChild(cloneTermDef);
    count++;
    popupAdd.scrollTop = popupAdd.scrollHeight;
    deleteTermFunc();
})

deleteTermFunc();

function scrollSticky(){
    var popupSticky = document.querySelector(".popup_content-sticky");
    if(this.scrollTop > 100){
        // popupAdd.style.padding = '0px 20px 60px';
        popupSticky.style.display = 'flex';
    }
    else{
        // popupAdd.style.padding = '45px 20px 60px'
        popupSticky.style.display = 'none';
    }

}
popupAdd.addEventListener('scroll', scrollSticky);