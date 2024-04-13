// ==================== lấy URL ===================
var currentURL = window.location.href;

// Chuỗi cần xoá
var textToRemove = "http://localhost:8080/flashcard/";

// Sử dụng phương thức replace() kết hợp với biểu thức chính quy để xoá chuỗi cần xoá
var modifiedString = currentURL.replace(new RegExp(textToRemove, "g"), "");
var titleName = document.querySelector(".titleName").querySelector("h2");
var arrWordTN = [];
var arrWordDN = [];
const fetchData = async (modifiedString) => {
    await fetch("/flashcard-get-detail/" + modifiedString)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            displayData(data);
        })
        .catch((error) => {
            console.error("Đã xảy ra lỗi:", error);
        });
};
const displayData = (data) => {
    titleName.textContent = data.titleName.Name;
    for (i = 0; i < data.flashcards.length; i++) {
        arrWordTN.push(data.flashcards[i].TermTN);
        arrWordDN.push(data.flashcards[i].TermDN);
    }
};

const backBtn = document.querySelector(".back-wrap");
const nextBtn = document.querySelector(".next-wrap");
var flipCardTN = document.querySelector(".flip-card_content");
var flipCardDN = document.querySelector(".flip-card-back");
var progressText = document.querySelector(".progress-text").querySelector("p");
var progressBar = document.querySelector(".progress-bar");
var playBtn = document.querySelector(".play-wrap");
var shuffleBtn = document.querySelector(".shuffle-wrap");
var playIcon = playBtn.querySelector("i");
const synchronousFunc = async (modifiedString) => {
    await fetchData(modifiedString);

    var length = arrWordTN.length - 1;
    var progress_unit = 100 / (length + 1);
    var halfLength = parseInt((length + 1) / 2);
    var progress = progress_unit * halfLength;
    var back = halfLength - 1 - 1;
    var next = halfLength - 1 + 1;
    var presentWord = halfLength - 1;
    var check;
    var play = true;
    //init value
    progressBar.style.width = progress + "%";
    progressText.textContent = halfLength + "/" + (length + 1);
    flipCardTN.textContent = arrWordTN[halfLength - 1];
    flipCardDN.textContent = arrWordDN[halfLength - 1];
    backBtn.addEventListener("click", () => {
        backFunc();
    });
    nextBtn.addEventListener("click", () => {
        nextFunc();
    });

    var playCheck = false;
    playBtn.addEventListener("click", () => {
        if (play) {
            playBtn.style.border = "1px solid gray";
            playIcon.classList.remove("ri-play-fill");
            playIcon.classList.add("ri-pause-line");
            flipCardInner.style.cursor = "not-allowed";
            playCheck = true;
            flipCard.removeEventListener("click", flipAction);
            const loopActions = () => {
                //action 1
                nextFunc();
                setTimeout(function () {
                    // action 2
                    checkPause();
                }, 3000);
            };

            // Gọi hàm loopActions lần đầu tiên
            loopActions();

            // Lặp lại hành động sau mỗi 3 giây
            check = setInterval(loopActions, 6000);
            play = false;
        } else {
            flipCard.addEventListener("click", flipAction);
            flipCardInner.style.cursor = "pointer";
            playBtn.style.border = "none";
            playIcon.classList.remove("ri-pause-line");
            playIcon.classList.add("ri-play-fill");
            play = true;
            playCheck = false;
            clearInterval(check);
        }
    });
    const checkPause = () => {
        if (playCheck) {
            flipCardInner.style.transform = "rotateX(" + angle + "deg)";
            angle += 180;
        }
    };
    const nextFunc = () => {
        //reset lại hiệu ứng rotate
        flipCardInner.style.transform = "none";
        angle = 180;

        back = next - 1 < 0 ? length : next - 1;

        //thanh progressbar
        if (progress + progress_unit > 100) progress = progress_unit;
        else progress += progress_unit;
        progressBar.style.width = progress + "%";

        //progress text
        progressText.textContent = next + 1 + "/" + (length + 1);

        //gán text cho flipcard
        flipCardTN.textContent = arrWordTN[next];
        flipCardDN.textContent = arrWordDN[next];
        presentWord = next;

        //thêm hiệu ứng lướt
        flipCardInner.classList.add("nextEffect");

        //cập nhật con chạy
        if (next + 1 > length) {
            next = 0;
        } else {
            next++;
        }
        setTimeout(() => {
            //bỏ hiệu ứng lướt
            flipCardInner.classList.remove("nextEffect");
        }, 220);
    };
    const backFunc = () => {
        //reset lại hiệu ứng rotate
        flipCardInner.style.transform = "none";
        angle = 180;

        next = back + 1 > length ? 0 : back + 1;

        if (progress - progress_unit <= 0) progress = 100;
        else progress -= progress_unit;
        progressBar.style.width = progress + "%";
        progressText.textContent = back + 1 + "/" + (length + 1);
        //gán text cho flipcard
        flipCardTN.textContent = arrWordTN[back];
        flipCardDN.textContent = arrWordDN[back];
        presentWord = back;

        //thêm hiệu ứng lướt
        flipCardInner.classList.add("backEffect");

        //cập nhật con chạy
        if (back - 1 < 0) {
            back = length;
        } else {
            back--;
        }
        setTimeout(() => {
            flipCardInner.classList.remove("backEffect");
        }, 220);
    };
    var shuffle = true;
    var arrWordTN_temp = arrWordTN.slice();
    var arrWordDN_temp = arrWordDN.slice();
    var initTN_temp;
    var initDN_temp;
    var antiDuplicate = "init";
    shuffleBtn.addEventListener("click", () => {
        initTN_temp = arrWordTN_temp[presentWord];
        initDN_temp = arrWordDN_temp[presentWord];
        if (shuffle) {
            console.log("true");
            //tránh lặp từ đầu tiên
            while(shuffle){
                shuffleArray(arrWordTN, arrWordDN);
                console.log("check anti: " + antiDuplicate);
                if(arrWordTN[presentWord] != initTN_temp && arrWordTN[presentWord] != antiDuplicate){
                    antiDuplicate = arrWordTN[presentWord].slice();
                    break;
                } 
            }
            console.log(arrWordTN[presentWord]);

            flipCardTN.textContent = arrWordTN[presentWord];
            flipCardDN.textContent = arrWordDN[presentWord];
            shuffle = false;
        }
        else{
            console.log("false");
            arrWordTN = arrWordTN_temp.slice();
            arrWordDN = arrWordDN_temp.slice();
            console.log(arrWordTN[presentWord]);
            flipCardTN.textContent = initTN_temp;
            flipCardDN.textContent = initDN_temp;
            shuffle = true;
        }
    });
    function shuffleArray(array, arrayLink) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            [arrayLink[currentIndex], arrayLink[randomIndex]] = [arrayLink[randomIndex], arrayLink[currentIndex]];
        }
    }
};
synchronousFunc(modifiedString);
