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

// ==================== NAV MENU =======================
var verticalMenu = document.querySelector(".vertical-menu");
var avatar = document.querySelector(".circle");

const avaMenu = () => {
    var headerHeight = document.querySelector(".header").offsetHeight;
    var containerHeaderWidth = document.querySelector(".container").offsetWidth;
    verticalMenu.style.top = headerHeight + "px";
    console.log("header:" + headerHeight);
    verticalMenu.style.right = (window.innerWidth - containerHeaderWidth) / 2 + "px";
}
avaMenu();
window.addEventListener('resize', () => {
    console.log("check");
    avaMenu();
})
window.addEventListener('scroll', () => {
    verticalMenu.style.display = 'none';
    menuON = true;
})
var menuON = true;
avatar.addEventListener('click', () => {
    if(menuON){
        verticalMenu.style.display = 'block';
        menuON = false;
    }
    else{
        verticalMenu.style.display = 'none';
        menuON = true;
    }
})
/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

scrollHeader();

// ==================== FLASH CARD =============================
var flipCard = document.querySelector(".flip-card");
var flipCardInner = document.querySelector(".flip-card-inner");
var angle = 180;
    flipCard.addEventListener('click', flipAction);
function flipAction(){
    flipCardInner.style.transform = 'rotateX(' + angle + 'deg)';
    angle += 180;
}

// ================= SHOW POPUP ==================
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

var popupMore = document.querySelector('.popup_more-add');
var popupMoreEdit = document.querySelector('.popup_more-edit');

// ================ EDIT POPUP ===================
const createList = document.querySelectorAll(".createList");
const editList = document.querySelectorAll(".editList");
var editFlashcardStickyTitle = document.querySelector(".popup_content-sticky").querySelector("h2");
var editFlashcardTitle = document.querySelector(".popup_content").querySelector("h1");
var deleteTerm;
var oldEditFlashcard;
// var checkReload = true;
togglebtn.addEventListener('click', () => {
    oldEditFlashcard = "oce";
    //xoá nội dung bên trong box
    var check = document.querySelectorAll(".termDef");
    for (var i = check.length - 1; i >= 2; i--) {
        // Loại bỏ phần tử con khỏi khối div
        termDefWrap.removeChild(check[i]);
    }
    //update lại số phần tử delete icon
    deleteTerm = document.querySelectorAll('.deleteTerm');

    termInput.value = ""
    document.querySelectorAll(".termTN").forEach((i) => {
        i.value = "";
    }) 
    document.querySelectorAll(".termDN").forEach((i) => {
        i.value = "";
    }) 
    //reset hiệu ứng termName
    termName.style.display = 'flex';
    termTitle.style.display = 'none';

    // display nút create
    createList.forEach((y) => {
        y.style.display = "block";
    });
    editList.forEach((x) => {
        x.style.display = "none";
    });
    //sửa lại content title
    editFlashcardTitle.textContent = 'Tạo học phần mới';
    editFlashcardStickyTitle.textContent = 'Tạo học phần mới';

    //thay đổi nút popup more khác
    popupMore.style.display =  'flex';
    popupMoreEdit.style.display = 'none';
    popupAdd.style.display = "block";
    popupOverlay.style.display = "block";
    document.body.style.overflow = 'hidden';
})
togglebtn2.addEventListener('click', () =>{
    window.location.href = '/flashcard/favorite';
})
popupClose.addEventListener('click', () => {
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
    deleteTerm = document.querySelectorAll('.deleteTerm');
    deleteTerm.forEach((item) => {
        item.addEventListener('click', () => {
            if(deleteTerm.length > 2){
                item.parentNode.parentNode.remove();
                updateNumber();
                deleteTerm = document.querySelectorAll('.deleteTerm');
            }
        })
    })
}
var popupMoreEdit_id;
var updateNumber = () => {
    var num = 1;
    var numberList = document.querySelectorAll(".termDef_header-content");
    var tTN = document.querySelectorAll(".termTN");
    var tDN = document.querySelectorAll(".termDN");
    var cnt = 1;
    var cnt2 = 1;
    numberList.forEach((item) => {
        item.textContent = num;
        num++;
    })
    tTN.forEach((i) => {
        i.id = "tTN" + cnt;
        cnt++;
    })
    tDN.forEach((i) => {
        i.id = "tDN" + cnt2;
        cnt2++;
    })
    if(popupMore.style.display == 'flex'){
        count = num;
    }
    if(popupMoreEdit.style.display == 'flex'){
        popupMoreEdit_id = num;
    }
}

var cloneTermDef = termDef.cloneNode(true);
cloneTermDef.querySelector(".termDef_header-content").textContent = 2;
cloneTermDef.querySelector(".termTN").id = "tTN2";
cloneTermDef.querySelector(".termTN").value = "";
cloneTermDef.querySelector(".termDN").id = "tDN2";
cloneTermDef.querySelector(".termDN").value = "";
termDefWrap.appendChild(cloneTermDef);
var count = 3;

popupMore.addEventListener('click', () => {
    var cloneTermDef = termDef.cloneNode(true);
    cloneTermDef.querySelector(".termDef_header-content").textContent = count;
    cloneTermDef.querySelector(".termTN").id = "tTN" + count;
    cloneTermDef.querySelector(".termTN").value = "";
    cloneTermDef.querySelector(".termDN").id = "tDN" + count;
    cloneTermDef.querySelector(".termDN").value = "";
    termDefWrap.appendChild(cloneTermDef);
    count++;
    popupAdd.scrollTop = popupAdd.scrollHeight;
    deleteTermFunc();
})

deleteTermFunc();


// =============================== CHECK INPUT ===============================

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

//==================== RESPONSIVE BOX =========================
var headerHeight = document.querySelector(".header").offsetHeight;
headerHeight = headerHeight / 2 - 5;
popupAdd.style.transform = "translate(-50%, calc(-50% + " + headerHeight + "px))";


// ============================== USER ID ===============================
const userid = document.querySelector(".userid").textContent;


