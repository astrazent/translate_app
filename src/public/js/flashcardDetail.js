// ==================== lấy URL ===================
var currentURL = window.location.href;

//lấy id trong url
const parts = currentURL.split('/');
const modifiedString = parts.pop();
var titleName = document.querySelector(".titleName").querySelector("h2");
var arrWordTN = [];
var arrWordDN = [];
const fetchData = async (modifiedString) => {
    await fetch("/flashcard-get-detail/" + userid + "/" + modifiedString)
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
const favoriteWord = (arr) => {
    for(i = 0; i < arr.length; i++){
        arrWordTN.push(arr[i].TranslateFrom);
        arrWordDN.push(arr[i].TranslateTo);
    }
}
const displayData = (data) => {
    if(data.titleName == -1){
        titleName.textContent = "Review: Favorite word";
        favoriteWord(data.resultsfav);
        return;
    }
    titleName.textContent = data.titleName.Name;
    for (i = 0; i < data.flashcards.length; i++) {
        arrWordTN.push(data.flashcards[i].TermTN);
        arrWordDN.push(data.flashcards[i].TermDN);
    }
};
const backBtn = document.querySelector(".back-wrap");
const nextBtn = document.querySelector(".next-wrap");
var flipCardTN = document.querySelector(".flip-card_content");
var flipCardDN = document.querySelector(".flip-card_content-back");
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
    var back = halfLength - 1 - 1 < 0 ? length : halfLength - 1 - 1;
    var next = halfLength - 1 + 1;
    var presentWord = halfLength - 1;
    var check;
    var speed = 3000;
    var play = true;
    var antiColapse = 1;
    var antiSpamPlay = 0;
    //init value
    progressBar.style.width = progress + "%";
    progressText.textContent = halfLength + "/" + (length + 1);
    flipCardTN.textContent = arrWordTN[halfLength - 1];
    flipCardDN.textContent = arrWordDN[halfLength - 1];
    var playCheck = true;
    var nextAction = false;
    backBtn.addEventListener("click", () => {
        backFunc();
    });
    nextBtn.addEventListener("click", () => {
        nextAction = true;
        nextFunc();
        nextAction = false;
    });

    //thêm notification
    var activeControllerFront = document.querySelector(".activeControllerFront");
    var activeControllerBack = document.querySelector(".activeControllerBack");
    var activeControllerContentFront = document.querySelector(".activeController_contentFront");
    var activeControllerContentBack = document.querySelector(".activeController_contentBack");
    var stateFront = document.querySelector(".stateFront");
    var stateBack = document.querySelector(".stateBack");
    var removeNofitication = (i) => {
        setTimeout(() => {
            if(i == antiColapse){
                activeControllerFront.style.display = 'none';
                activeControllerBack.style.display = 'none';
            }
        }, 3000)
    }
    const loopActions = (antiSpam) => {
        setTimeout(() => {
            if(antiSpam == antiSpamPlay){
                //action 1
                nextFunc();
            }
        }, speed)
        setTimeout(function () {
            if(antiSpam == antiSpamPlay){
                // action 2
                checkPause();
            }
        }, (speed * 2) - 500);
    };
    playBtn.addEventListener("click", () => {
        activeControllerContentFront.textContent = "Card auto-scroll is "
        activeControllerContentBack.textContent = "Card auto-scroll is "
        if (play) {
            //bỏ mouseLeave để speed cố định
            leftWrap.removeEventListener('mouseleave', mouseLeave);
            //thêm notification dưới flashcard
            activeControllerFront.style.display = 'flex';
            activeControllerBack.style.display = 'flex';
            stateFront.textContent = "ON";
            stateBack.textContent = "ON";
            antiColapse++;
            removeNofitication(antiColapse);
            playIcon.classList.remove("ri-play-fill");
            playIcon.classList.add("ri-pause-line");
            flipCardInner.style.cursor = "not-allowed";
            playCheck = true;
            flipCard.removeEventListener("click", flipAction);
            // Gọi hàm loopActions lần đầu tiên
            loopActions(++antiSpamPlay);
            // Lặp lại hành động sau mỗi 3 giây
            check = setInterval(() => {
                loopActions(++antiSpamPlay);
            }, speed * 2);
            play = false;
        } else {
            //thêm mouseLeave
            leftWrap.addEventListener('mouseleave', mouseLeave);
            activeControllerFront.style.display = 'flex';
            activeControllerBack.style.display = 'flex';
            stateFront.textContent = "OFF";
            stateBack.textContent = "OFF";
            antiColapse++;
            removeNofitication(antiColapse);
            flipCard.addEventListener("click", flipAction);
            flipCardInner.style.cursor = "pointer";
            playIcon.classList.remove("ri-pause-line");
            playIcon.classList.add("ri-play-fill");
            play = true;
            playCheck = false;
            clearInterval(check);
        }
    });
    const checkPause = () => {
        if (playCheck) {
            console.log("checkplay");
            flipCardInner.style.transform = "rotateX(" + angle + "deg)";
            angle += 180;
        }
    };
    const nextFunc = () => {
        if(playCheck || nextAction){
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
        }
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
            activeControllerContentFront.textContent = "Card shuffle is "
            activeControllerContentBack.textContent = "Card shuffle is "
            //thêm notification dưới flashcard
            activeControllerFront.style.display = 'flex';
            activeControllerBack.style.display = 'flex';
            stateFront.textContent = "ON";
            stateBack.textContent = "ON";
            antiColapse++;
            removeNofitication(antiColapse);
            //display border shuffle
            shuffleBtn.style.border = "1px solid gray";
            //tránh lặp từ đầu tiên
            var antiLoop = 1;
            while(shuffle){
                shuffleArray(arrWordTN, arrWordDN);
                console.log(arrWordTN);
                // console.log(arrWordTN[presentWord] + " " + antiDuplicate);
                if(arrWordTN[presentWord] != initTN_temp && arrWordTN[presentWord] != antiDuplicate){
                    antiDuplicate = arrWordTN[presentWord].slice();
                    break;
                }
                else if(arrWordTN.length <= 2){
                    break;
                }
                else{
                    if(antiLoop > 10){
                        console.log("Shuffle error!");
                        break;
                    }
                }
                antiLoop++;
            }
            //reset lại hiệu ứng rotate
            flipCardInner.style.transform = "none";
            flipCardInner.style.transition = "none";
            angle = 180;
            flipCardTN.textContent = arrWordTN[presentWord];
            setTimeout(() => {
                flipCardDN.textContent = arrWordDN[presentWord];
                flipCardInner.style.transition = "transform 0.3s";
            }, 100)
            shuffle = false;
        }
        else{
            activeControllerContentFront.textContent = "Card shuffle is "
            activeControllerContentBack.textContent = "Card shuffle is "
            //thêm notification dưới flashcard
            activeControllerFront.style.display = 'flex';
            activeControllerBack.style.display = 'flex';
            stateFront.textContent = "OFF";
            stateBack.textContent = "OFF";
            antiColapse++;
            removeNofitication(antiColapse);
            //undisplay border shuffle
            shuffleBtn.style.border = "none";
            //reset lại hiệu ứng rotate
            flipCardInner.style.transform = "none";
            flipCardInner.style.transition = "none";
            angle = 180;
            arrWordTN = arrWordTN_temp.slice();
            arrWordDN = arrWordDN_temp.slice();
            flipCardTN.textContent = initTN_temp;
            setTimeout(() => {
                flipCardDN.textContent = initDN_temp;
                flipCardInner.style.transition = "transform 0.3s";
            }, 100)
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

    //speed 
    var speed15 = document.querySelector(".speed15");
    var speed2 = document.querySelector(".speed2");
    var speed25 = document.querySelector(".speed25");
    var speed3 = document.querySelector(".speed3");
    var speedAll = document.querySelectorAll(".speed");
    var leftWrap = document.querySelector(".left-wrap");
    var oldSpeed;
    const speedModify = (spd) => {
        oldSpeed = speed;
        speed = spd;
        if(!play){
            playCheck = false;
            clearInterval(check);
            setTimeout(() => {
                playCheck = true;
                check = setInterval(() => {
                    loopActions(++antiSpamPlay);
                }, spd * 2);
            }, oldSpeed * 2);
        }
    }
    const clearSpeed = () => {
        speedAll.forEach((item) => {
            if(item.classList.contains("activeSpeed")){
                item.classList.remove("activeSpeed");
            }
        })
    }
    var speed15ON = true;
    var speed2ON = true;
    var speed25ON = true;
    var speed3ON = true;
    const resetSpeedON = () => {
        speed15ON = true;
        speed2ON = true;
        speed25ON = true;
        speed3ON = true;
    }
    speed15.addEventListener('click', () => {
        if(speed15ON){
            speedModify(3000 / 1.5);
            resetSpeedON();
            clearSpeed();
            speed15.classList.add("activeSpeed");
            speed15ON = false;
        }
        else{
            speed = 3000;
            speedModify(speed);
            speed15ON = true;
        }
    });
    speed2.addEventListener('click', () => {
        if(speed2ON){
            speedModify(3000 / 2);
            resetSpeedON();
            clearSpeed();
            speed2.classList.add("activeSpeed");
            speed2ON = false;
        }
        else{
            speed = 3000;
            speedModify(speed);
            speed2ON = true;
        }
    });
    speed25.addEventListener('click', () => {
        if(speed25ON){
            speedModify(3000 / 2.5);
            resetSpeedON();
            clearSpeed();
            speed25.classList.add("activeSpeed");
            speed25ON = false;
        }
        else{
            speed = 3000;
            speedModify(speed);
            speed25ON = true;
        }
    });
    speed3.addEventListener('click', () => {
        if(speed3ON){
            speedModify(3000 / 3);
            resetSpeedON();
            clearSpeed();
            speed3.classList.add("activeSpeed");
            speed3ON = false;
        }
        else{
            speed = 3000;
            speedModify(speed);
            speed3ON = true;
        }
    });
    var checkM = true;
    var mouseCnt = 1;
    const checkMouse = (i) => {
        setTimeout(() => {
            if(i == mouseCnt){
            checkM = true;
            }
        }, 300);
    }
    // Thêm sự kiện mouseenter để thực hiện khi con trỏ chuột vào phần tử
    function mouseEnter() {
        if(checkM){
            speedAll.forEach((item) => {
                item.classList.remove("invisible");
                item.classList.add("visible");
            })      
            checkM = false;
        }
    }
    function mouseLeave() {
        checkMouse(++mouseCnt);
        speedAll.forEach((item) => {
            item.classList.remove("visible");
            item.classList.add("invisible");
        })       
    }
    playBtn.addEventListener('mouseenter', mouseEnter);
    leftWrap.addEventListener('mouseleave', mouseLeave);
};
synchronousFunc(modifiedString);
