const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
let selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector(".translateBtn");

//product-list
var productListContainer = document.getElementById("product-list-container");
var productListContainerFavor = document.getElementById("product-list-container-favor");

//đóng mở sidebar
var togglebtn = document.querySelector('.toggle-btn');
var togglebtn2 = document.querySelector('.toggle-btn2');
var box = document.querySelector('.box');
var box1 = document.querySelector('.box1');
var sidebar = box.querySelector('.sidebar');
var sidebar1 = box1.querySelector('.sidebar');

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "vi-VN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchageIcon.addEventListener("click", () => {
    tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

antiSpam = '';
translateBtn.addEventListener("click", async () => {
    await translateApi();
});

fromText.addEventListener("keydown", async (event) => {
    if(event.ctrlKey && event.key === "Enter"){
        await translateApi();
    }
    // if(!fromText.value){
    //     var closeBox = document.createElement("i");
    //     closeBox.classList.add("fa-solid", "fa-xmark");
    //     // closeBox.style.position = "absolute";
    //     // closeBox.style.right = '10px';
    //     fromText.appendChild(closeBox);
    // }
})

var textBox = document.querySelector(".text-box");
var product = document.createElement("i");
product.classList.add("fa-solid", "text-box-close", "fa-xmark", "fa-xl");
product.style.display = "none";
textBox.appendChild(product);

fromText.addEventListener('keydown', () => {
    setTimeout(() => {
        var value = fromText.value;
        if(value.length != 0){
            product.style.display = "inline";
        }
        else{
            product.style.display = "none";
        }
    }, 10)
})

product.addEventListener('click', () => {
    fromText.value = '';
    toText.value = '';
    product.style.display = "none";
})

//Lấy api dịch thuật và lưu vào history
translateApi = async () => {
    let text = fromText.value.trim(), //lấy dữ liệu từ text form
    translateFrom = selectTag[0].value == "en-GB" && selectTag[1].value == "vi-VN" ? "tr-TR" : selectTag[0].value;
    translateTo = selectTag[1].value;
    if(!text) return; //có text không 
    if(antiSpam === text){
        alert("Don't spam translate button")
        return;
    } 
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    await fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
        antiSpam = text;
    });

    //history translate
    if(toText.value){
        let data = {
            translateFrom: fromText.value.trim(),
            translateToText: toText.value,
            languageFrom: countries[selectTag[0].value],
            languageTo: countries[selectTag[1].value]
        }
        fetch("/api/translate-history", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => res.json()).then(data => {
            if(data.status == "success"){
                console.log(data.message);
            }
            else{
                console.log("You have an error!");
            }
        })
    }
}

//speech
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
var his = '';
var speech = true;
var dot = 1;
var dot2 = false;
var firstSentences = true;
recognition.interimResults = true;
recognition.addEventListener('result', (e) => {
    let transcript = Array.from(e.results).map(result => result[0]).map(result =>result.transcript).join('')

    //xử lý kết quả
    transcript = transcript.toLowerCase();


    //Nhận dạng dấu phẩy
    if(transcript.includes("dấu phẩy")){
        transcript = transcript.replace(" dấu phẩy", ",") == 'dấu phẩy' ? transcript.replace("dấu phẩy", ",") : transcript.replace(" dấu phẩy", ",");
        if(transcript === ","){
            his = his.trim()
        }
    }

    //Nhân dạng dấu chấm
    if(transcript.includes("dấu chấm")){
        transcript = transcript.replace(" dấu chấm", ".") == 'dấu chấm' ? transcript.replace("dấu chấm", ".") : transcript.replace(" dấu chấm", ".");

        //nếu transcript là một câu mới bắt đầu bằng từ "dấu chấm"
        if(transcript === "."){
            his = his.trim()
            dot = 2;
        }
        //nếu transcript là một câu liền mạch và có từ "dấu chấm" bên trong
        else{
            var set = transcript.indexOf(".");
            transcript = transcript.slice(0, set + 2) + transcript.charAt(set + 2).toUpperCase() + transcript.slice(set + 3);
        }
    }
    

    if(e.results[0].isFinal){
        // viết hoa chữ dầu câu sau dấu chấm đó (trường hợp "dấu chấm" đầu câu)
        if(dot == 3){
            transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
            dot = 1;
        }
        his += (transcript + ' ');
        if(firstSentences){
            //viết hoa chữ cái đầu tiên 
            his = his.charAt(0).toUpperCase() + his.slice(1);
            firstSentences = false;
        }
        //bỏ qua câu chứa dấu chấm
        if(dot == 2){
            dot = 3;
        }
    }
    else{
        fromText.value = his + transcript;
    }
})

//icon action
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            if(!fromText.value || !toText.value) return;
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } 
        else if(target.classList.contains("fa-volume-up")){
            if(!fromText.value || !toText.value) return;
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }
        else{
            if(target.classList.contains("fa-microphone")){
                target.classList.remove("fa-microphone");
                target.classList.add("fa-stop");
                var checkMic = false;
            }
            else{
                target.classList.remove("fa-stop");
                target.classList.add("fa-microphone");
                var checkMic = true;
            }
            if(!checkMic){
                recognition.addEventListener('end', () => {
                    if(speech){
                        recognition.start();
                    }
                })
                his = '';
                fromText.value = '';
                recognition.start();
                speech = true;
            }
            else{
                recognition.abort();
                speech = false;
            }
        }
    });
});


//hiệu ứng đóng mở sidebar
//history button
togglebtn.addEventListener('click', () => {
    sidebar.style.width = sidebar.style.width === '350px' ? '0' : '350px';
    mask(sidebar.style.width);
    if(sidebar.style.width === '350px'){
        productListContainer.innerHTML = '';
        ListData();
    }
})


//favorite button
togglebtn2.addEventListener('click', () => {
    sidebar1.style.width = sidebar1.style.width === '350px' ? '0' : '350px';
    mask(sidebar1.style.width);
    if(sidebar1.style.width === '350px'){
        productListContainerFavor.innerHTML = '';
        favoriteData();
    }
})

//đóng sidebar khi click ra màn hình
document.onclick = function(e){
    if(sidebar.style.width === '350px'){
        closeSideBar(sidebar, togglebtn, e)
    }
    if(sidebar1.style.width === '350px'){
        closeSideBar(sidebar1, togglebtn2, e)
    }
}

const closeSideBar = (sidebar, togglebtn, e) => {
    if (!sidebar.contains(e.target) && !togglebtn.contains(e.target) && sidebar.style.width) {
        sidebar.style.width = '0';
        mask(sidebar.style.width);
    }
}

mask = (check) => {
    var mask = document.querySelector(".overlay");
    if(check === '350px'){
        mask.style.display = "block";
    }
    else{
        mask.style.display ="none";
    }
}

//kiểm tra trạng thái kết nối tới server
window.addEventListener('offline', () => {
    window.alert("lost connection");
})

//lấy ra các từ đã dịch từ server
const ListData = () => {
    const api = "/api/translate-list";
    // Sử dụng fetch để lấy dữ liệu từ API
    fetch(api)
    .then(response => {
    // Kiểm tra xem yêu cầu có thành công không (status code 200)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse dữ liệu JSON từ response
    return response.json();
    })
    .then(data => {
    // Xử lý dữ liệu đã được parse
    item(data);
    })
    .catch(error => {
    // Xử lý lỗi nếu có
    console.error('Fetch error:', error);
    });
}

//lấy ra dữ liệu yêu thích từ server
const favoriteData = ()  => {
    const favorapi = '/api/translate-favorite-list'
    fetch(favorapi)
    .then(response => {
    // Kiểm tra xem yêu cầu có thành công không (status code 200)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse dữ liệu JSON từ response
    return response.json();
    })
    .then(data => {
    // Xử lý dữ liệu đã được parse
    itemFavor(data);
    })
    .catch(error => {
    // Xử lý lỗi nếu có
    console.error('Fetch error:', error);
    });
}

// lịch sử các từ đã dịch 
const item = (data) => {

    if(!data.length){
        console.log("No item");
        return;
    }
    // danh sách các từ đã dịch
    data.reverse().forEach((list) => {
        //Tạo icon heart
        var heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-regular', 'fa-heart', 'fa-lg'); // Sử dụng lớp của Font Awesome cho biểu tượng trái tim
        if(list.FavoriteId === '1'){
            heartIcon.classList.toggle('fa-solid');
        }
        heartIcon.style.marginLeft = '70px'; // Thêm khoảng cách nếu cần
        heartIcon.style.position = 'absolute';
        heartIcon.style.right = '40px';
        heartIcon.style.top = '20px';
        heartIcon.style.cursor = 'pointer';
        heartIcon.id = list.History_id;

        //Tạo nút delete
        // <i class="fa-solid fa-x" style="color: #ff3d5a;"></i>
        var deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-x', 'fa-lg');
        deleteIcon.style.position = 'absolute';
        deleteIcon.style.top = '20px';
        deleteIcon.style.right = '10px';
        deleteIcon.style.cursor = 'pointer';
        deleteIcon.style.color = '#ff3d5a';
        deleteIcon.name = list.History_id;

        //Tạo nút sound
        var soundIcon = document.createElement('i');
        soundIcon.classList.add('fa-solid', 'fa-volume-low', 'fa-lg');
        soundIcon.style.marginLeft = '10px';
        soundIcon.style.cursor = 'pointer';
        soundIcon.style.color = '#ffd43b';
        soundIcon.setAttribute("text", list.TranslateFrom);
        soundIcon.setAttribute("language", list.LanguageFrom);
        var soundIcon2 = document.createElement('i');
        soundIcon2.classList.add('fa-solid', 'fa-volume-low', 'fa-lg');
        soundIcon2.style.marginLeft = '0px';
        soundIcon2.style.cursor = 'pointer';
        soundIcon2.style.color = '#ffd43b';
        soundIcon2.setAttribute("text", list.TranslateTo);
        soundIcon2.setAttribute("language", list.LanguageTo);
        
        //Tạo nút copy
        var copy = document.createElement('i');
        copy.classList.add('fa-solid', 'fa-copy', 'fa-lg');
        copy.style.marginLeft = '15px';
        copy.style.cursor = 'pointer';
        copy.style.color = '#ffd43b';
        copy.setAttribute("text", list.TranslateFrom);
        var copy2 = document.createElement('i');
        copy2.classList.add('fa-solid', 'fa-copy', 'fa-lg');
        copy2.style.marginLeft = '15px';
        copy2.style.cursor = 'pointer';
        copy2.style.color = '#ffd43b';
        copy2.setAttribute("text", list.TranslateTo);

        // Add vào chung một box
        var box = document.createElement("div");
        box.style.marginTop = '10px'
        box.appendChild(soundIcon)
        box.appendChild(copy)
        var box2 = document.createElement("div");
        box2.style.marginTop = '5px'
        box2.appendChild(soundIcon2)
        box2.appendChild(copy2)

        //Tạo box từ
        var productDiv = document.createElement("div");
        productDiv.classList.add("product");
        var productName = document.createElement("h3");
        productName.textContent = list.LanguageFrom + '-->' + list.LanguageTo;
        productName.appendChild(heartIcon);
        productName.appendChild(deleteIcon);
        
        var productContent = document.createElement("p");
        productContent.style.wordWrap = 'break-word';
        productContent.innerHTML = list.TranslateFrom;
        productContent.appendChild(box);
        
        var productPrice = document.createElement("p");
        productPrice.style.wordWrap = 'break-word';
        productPrice.classList.add("price");
        productPrice.textContent = list.TranslateTo;
        productPrice.appendChild(box2);


        //thêm vào box lớn
        productDiv.appendChild(productName);
        productDiv.appendChild(productContent);
        productDiv.appendChild(productPrice);
        productListContainer.appendChild(productDiv);
    });

    //tạo hiệu ứng bật tắt tim
    const hearts = document.getElementsByClassName("fa-heart");
    try {
        for(let key in hearts){
                hearts[key].addEventListener('click', () => {
                    let check = hearts[key].classList.toggle('fa-solid');
                    updateKey(check, hearts[key].id)
            });
        }
    } catch (error) {
        // bỏ qua lỗi fetch error
    }

    //xoá phần tử khi được đóng (x)
    const close = document.getElementsByClassName("fa-x");
    try {
        for(let key in close){
                close[key].addEventListener('click', () => {
                    var productId = close[key].name;
                    deleteKey(productId);
                    close[key].parentNode.parentNode.style.display = 'none';
            });
        }
    } catch (error) {
        // bỏ qua lỗi fetch error
    }

    //Phát âm thanh
    const sound = document.getElementsByClassName("fa-volume-low");
    try {     
        for(let key in sound){
            sound[key].addEventListener('click', () => {
                let speech = sound[key].getAttribute("text");
                let language = sound[key].getAttribute("language");
    
                //tìm key khi đã biết value
                var foundKey = Object.entries(countries).find(([key, value]) => value === language);
                speech = new SpeechSynthesisUtterance(speech);
                speech.lang = foundKey;
                speechSynthesis.speak(speech);
            });
        }
    } catch (error) {
        // bỏ qua lỗi addeventlistener is not a function
    }

    //copy
    try {
        const copy = document.getElementsByClassName("fa-copy");
        for(let key in copy){
            copy[key].addEventListener('click', () => {
                let copyText = copy[key].getAttribute("text");
                console.log(copyText);
                navigator.clipboard.writeText(copyText);
            });
        }
    } catch (error) {
        // bỏ qua lỗi addeventlistener is not a function
    }
}

// danh sách từ yêu thích
const itemFavor = (data) => {
    //check data
    if(!data.length){
        console.log("No item");
        return;
    }
    // Hiển thị danh sách sản phẩm
    data.reverse().forEach((list) => {

        //Tạo nút delete
        var deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-x', 'fa-lg');
        deleteIcon.style.position = 'absolute';
        deleteIcon.style.top = '20px';
        deleteIcon.style.right = '10px';
        deleteIcon.style.cursor = 'pointer';
        deleteIcon.style.color = '#ff3d5a';
        // deleteIcon.dataset.favorId = list.Favorite_id;
        // deleteIcon.dataset.hisId = list.History_id;
        deleteIcon.setAttribute("favorId", list.Favorite_id);
        deleteIcon.setAttribute("hisId", list.History_id);

        var productDiv = document.createElement("div");
        productDiv.classList.add("product");
        var productName = document.createElement("h3");
        productName.textContent = list.LanguageFrom + '-->' + list.LanguageTo;
        productName.appendChild(deleteIcon);

        var productContent = document.createElement("p");
        productContent.innerHTML = list.TranslateFrom;

        var productPrice = document.createElement("p");
        productPrice.classList.add("price");
        productPrice.textContent = list.TranslateTo;
        productDiv.appendChild(productName);
        productDiv.appendChild(productContent);
        productDiv.appendChild(productPrice);
        productListContainerFavor.appendChild(productDiv);


    });

    //xoá phần tử khi được đóng (x)
    const close = document.getElementsByClassName("fa-x");
    try {
        for(let key in close){
                close[key].addEventListener('click', () => {
                    var favoriteId = close[key].getAttribute("favorId");
                    var historyId = close[key].getAttribute("hisId");
                    deleteFavorKey(favoriteId, historyId);
                    close[key].parentNode.parentNode.style.display = 'none';
            });
        }
    } catch (error) {
        // bỏ qua lỗi fetch error
    }
}

// cập nhật Favorite Id
const updateKey = (check, id) => {
    let data = {
        check: check,
        id: id
    }
    fetch("/api/translate-update-key", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json()).then(data => {
        if(data.status == "success"){
            console.log(data.message);
        }
        else{
            console.log("Update error!");
        }
    })
}

//xoá lịch sử dịch
// cập nhật Favorite Id
const deleteKey = (productId) => {
    let data = {
        id: productId
    }
    fetch("/api/translate-delete-key", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json()).then(data => {
        if(data.status == "success"){
            console.log(data.message);
        }
        else{
            console.log("Delete error!");
        }
    })
}


//xoá từ yêu thích
const deleteFavorKey = (favorId, hisId) => {
    let data = {
        favorId: favorId, 
        hisId: hisId
    }
    fetch("/api/delete-favorite-key", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json()).then(data => {
        if(data.status == "success"){
            console.log(data.message);
        }
        else{
            console.log("Delete error!");
        }
    })
}