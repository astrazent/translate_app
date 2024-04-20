// alert
let notifications = document.querySelector(".notifications");

//popup alert
let popupAlert = document.querySelector(".popup-box");
let btn1 = document.querySelector(".btn1");
let btn2 = document.querySelector(".btn2");

//warning length
var warningLength = document.querySelector(".warningLength");
createList.forEach((item) => {
    item.addEventListener("click", create_list);
});

function create_list() {
    if(addClass() == "errorLength"){
        return;
    }
    if(tI.value.trim().length > 100){
        warningLength.style.display = 'block';
        return;
    }
    else{
        warningLength.style.display = 'none';
    }
    var [arrTN, arrDN] = addClass();
    const create = {
        id: userid,
        tI: tI.value.trim(),
        tTN: arrTN,
        tDN: arrDN
    };
    if (!tI.value || arrTN.includes("") || arrDN.includes("")) {
        alert("vui lòng nhập đủ trường đã tạo!");
        return;
    }
    fetch("/api/flashcard-create", {
        method: "POST",
        body: JSON.stringify(create),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            let text = data.message;
            if (data.status == "error") {
                error(text);
            } else {
                //ẩn popup
                popupAdd.style.display = "none";
                popupOverlay.style.display = "none";
                document.body.style.overflow = 'auto';
                success(text);
            }
        });
    deleteFlashCardData();
    getTermData();
}

var addClass = () => {
    var numberList = document.querySelectorAll(".termDef_header-content");
    var arrTN = [];
    for (i = 1; i <= numberList.length; i++) {
        var tTN = document.getElementById("tTN" + i);
        if(tTN.value.trim().length > 100){
            warningLength.style.display = 'block';
            return "errorLength";
        }
        else{
            warningLength.style.display = 'none';
            arrTN.push(tTN.value.trim());
        }
    }
    var arrDN = [];
    for (i = 1; i <= numberList.length; i++) {
        var tDN = document.getElementById("tDN" + i);
        if(tDN.value.trim().length > 100){
            warningLength.style.display = 'block';
            return "errorLength";
        }
        else{
            warningLength.style.display = 'none';
            arrDN.push(tDN.value.trim());
        }
    }
    return [arrTN, arrDN];
};

// ========================= DISPLAY FLASHCARD LIST =============================

const createItem = () => {
    var termContainer = document.querySelector(".term_container");
    var flashcardListItem = document.createElement("div");
    flashcardListItem.className = "flashcard_list--item";
    termContainer.appendChild(flashcardListItem);
    var flashcardBoxTitle = document.createElement("div");
    flashcardBoxTitle.className = "flashcard_boxTitle";
    var flashcardListTitle = document.createElement("h2");
    flashcardBoxTitle.appendChild(flashcardListTitle);
    var flashcardBoxIcon = document.createElement("div");
    flashcardBoxIcon.className = "flashcard_boxIcon";
    var flashcardEditIcon = document.createElement("i");
    flashcardEditIcon.className = "ri-pencil-line edit";
    var flashcardDeleteIcon = document.createElement("i");
    flashcardDeleteIcon.className = "ri-delete-bin-7-line trash";
    var flashcardId = document.createElement("span");
    flashcardId.className = "flashcard_id";
    flashcardId.style.display = "none";
    flashcardBoxIcon.appendChild(flashcardEditIcon);
    flashcardBoxIcon.appendChild(flashcardDeleteIcon);
    flashcardBoxTitle.appendChild(flashcardListTitle);
    flashcardBoxTitle.appendChild(flashcardBoxIcon);
    flashcardListItem.appendChild(flashcardBoxTitle);
    flashcardListItem.appendChild(flashcardId);
    var termNum = document.createElement("div");
    termNum.className = "termNum";
    flashcardListItem.appendChild(termNum);
    var flashcardTotal = document.createElement("p");
    termNum.appendChild(flashcardTotal);
    var flashcardListTime = document.createElement("p");
    flashcardListTime.className = "dateModified";
    flashcardListItem.appendChild(flashcardListTime);
    return [flashcardId, flashcardListTitle, flashcardTotal, flashcardListTime];
};

var deleteStorage;
var getEditListFunc;
const getTermData = async () => {
    // Sử dụng fetch để gửi yêu cầu GET đến API
    console.log(userid);
    await fetch("/api/flashcard-get-list/" + userid)
        .then((response) => {
            // Kiểm tra xem phản hồi có thành công không
            if (!response.ok) {
                throw new Error("Đã có lỗi khi gửi yêu cầu: " + response.status);
            }
            // Nếu thành công, chuyển đổi phản hồi sang dạng JSON
            return response.json();
        })
        .then((data) => {
            // Xử lý dữ liệu khi đã nhận được
            getFlashCardData(data);
        })
        .catch((error) => {
            // Xử lý lỗi nếu có
            console.error("Đã xảy ra lỗi:", error);
        });

    // ================== DELETE FLASHCARD =========================
    const deleteFlashcard = document.querySelectorAll(".trash");
    deleteFlashcard.forEach((item) => {
        item.addEventListener("click", () => {
            popupAlert.style.display = 'block';
            popupOverlay.style.display = "block";
            popupAlert.querySelector("h1").textContent = 'Xoá thẻ ghi nhớ ' + "'" + item.parentNode.parentNode.querySelector("h2").textContent + "'" + " vĩnh viễn"
            document.body.style.overflow = "hidden";
            deleteStorage = item;
        });
    });



    // ================================== GET EDIT FLASHCARD ===============================
    const getEditFlashcard = document.querySelectorAll(".edit");
    var termInput = document.querySelector(".termInput");
    var termTN = document.querySelectorAll(".termTN");
    var termDN = document.querySelectorAll(".termDN");
    var edit_id;
    var poppopId;
    var temp;
    var checkReload;
    const getEditFunc = () => {
        getEditFlashcard.forEach((item) => {
            item.addEventListener("click", async () => {
                editFlashcardTitle.textContent = "Sửa học phần";
                editFlashcardStickyTitle.textContent = "Sửa học phần";
                createList.forEach((y) => {
                    y.style.display = "none";
                });
                editList.forEach((x) => {
                    x.style.display = "block";
                });
                popupAdd.style.display = "block";
                popupOverlay.style.display = "block";
                document.body.style.overflow = "hidden";
                popupMoreEdit.style.display = 'flex';
                popupMore.style.display = 'none';
                termName.style.display = 'block';
                termTitle.style.display = "block";
                var editId = item.parentNode.parentNode.parentNode.querySelector(".flashcard_id").textContent;
                edit_id = editId;
                checkReload = item.parentNode.parentNode.querySelector("h2").textContent == oldEditFlashcard ? false : true;
                oldEditFlashcard = item.parentNode.parentNode.querySelector("h2").textContent;
                if (checkReload) {
                    console.log("check");
                    checkReload = false;
                    var check = document.querySelectorAll(".termDef");
                    for (var i = check.length - 1; i >= 2; i--) {
                        // Loại bỏ phần tử con khỏi khối div
                        termDefWrap.removeChild(check[i]);
                    }
                    //biến này được sinh ra là để phục vụ popupmore edit
                    //biến ở file được load trước sẽ dùng được ở file load sau nhưng không có ngược lại 
                    var popupMore_id; 
                    var popupFlashCard_id;
                    // Lấy thông tin truyền vào form
                    await fetch("/flashcard-get-edit-list/" + userid + "/" + editId)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            termInput.value = data.titleName.Name;
                            var index = 0;
                            var index2 = 0;
                            var index3 = 0;
                            popupFlashCard_id = data.flashcards[data.flashcards.length - 1].Flashcard_id;
                            document.querySelectorAll(".termDef").forEach((i) => {
                                i.id = data.flashcards[index3].Flashcard_id;
                                index3++;
                            });
                            popupMore_id = data.flashcards.length;
                            for (i = 3; i <= popupMore_id; i++) {
                                var cloneTermDef = termDef.cloneNode(true);
                                cloneTermDef.querySelector(".termTN").id = "tTN" + i;
                                cloneTermDef.querySelector(".termDN").id = "tDN" + i;
                                cloneTermDef.querySelector(".termDef_header-content").textContent = i;
                                cloneTermDef.id = data.flashcards[i - 1].Flashcard_id;
                                termDefWrap.appendChild(cloneTermDef);
                                deleteTermFunc();
                            }
                            var editTermTN = document.querySelectorAll(".termTN");
                            var editTermDN = document.querySelectorAll(".termDN");
                            editTermTN.forEach((i) => {
                                i.value = data.flashcards[index].TermTN;
                                index++;
                            });
                            editTermDN.forEach((i) => {
                                i.value = data.flashcards[index2].TermDN;
                                index2++;
                            });
                        })
                        .catch((error) => {
                            console.error("Đã xảy ra lỗi:", error);
                        });
                    popupMore_id++;
                    //lý do phải gán như vậy vì updatenumber2 cần dùng lại popupFlashcard_id
                    var popupId = popupFlashCard_id + 1;
                    poppopId = popupFlashCard_id;
                    popupMoreEdit.addEventListener('click', () => {
                        var cloneTermDef = termDef.cloneNode(true);
                        if(!popupMoreEdit_id){
                            cloneTermDef.querySelector(".termDef_header-content").textContent = popupMore_id;
                            cloneTermDef.id = popupId;
                        }
                        else{
                            updateNumber2();
                            // popupId -= (popupMore_id - popupMoreEdit_id);
                            popupId = temp;
                            popupMore_id = popupMoreEdit_id;
                            cloneTermDef.querySelector(".termDef_header-content").textContent = popupMore_id;
                            cloneTermDef.id = popupId;
                            popupMoreEdit_id = undefined;
                        }
                        cloneTermDef.querySelector(".termTN").id = "tTN" + popupMore_id;
                        cloneTermDef.querySelector(".termTN").value = "";
                        cloneTermDef.querySelector(".termDN").id = "tDN" + popupMore_id;
                        cloneTermDef.querySelector(".termDN").value = "";
                        termDefWrap.appendChild(cloneTermDef);
                        popupMore_id++;
                        popupId++;
                        popupAdd.scrollTop = popupAdd.scrollHeight;
                        deleteTermFunc();
                    })
                }
            });
        });
    }
    getEditFunc();
    const updateNumber2 = () => {
        temp = poppopId + 1;
        document.querySelectorAll(".termDef").forEach((i) => {
            if(i.id > poppopId){
                i.id = temp;
                temp++;
            }
        })
    }
    //============================== EDIT FLASHCARD ================================
    function editListFunc(){
        checkReload = true;
        //check length
        if(addClass() == "errorLength"){
            return;
        }
        if(tI.value.trim().length > 100){
            warningLength.style.display = 'block';
            return;
        }
        else{
            warningLength.style.display = 'none';
        }
        updateNumber2();
        var check2 = document.querySelectorAll(".termDef");
        var flashcardId = [];
        check2.forEach((i) => {
            flashcardId.push(i.id);
        })
        var [arrTN, arrDN] = addClass();
        const paramId = {
            id: userid,
            flashcardId: flashcardId,
            editId: edit_id,
            name: tI.value.trim(),
            tTN: arrTN,
            tDN: arrDN,
        };
        if (!tI.value || arrTN.includes("") || arrDN.includes("")) {
            alert("vui lòng nhập đủ trường đã tạo!");
            return;
        }
        fetch("/flashcard-Edit-list", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paramId),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Có lỗi xảy ra");
                }
                return response.json();
            })
            .then((data) => {
                // Xử lý dữ liệu nhận được sau khi chỉnh sửa
                let text = data.message;
                if (data.status == "error") {
                    error(text);
                } else {
                    success(text);
                }
            })
            .catch((error) => {
                console.error("Đã xảy ra lỗi:", error);
            });
    }
    getEditListFunc = editListFunc;
    editList.forEach((i2) => {
        i2.addEventListener("click", getEditListFunc);
    });
    document.querySelectorAll(".flashcard_list--item").forEach((item) => {
        item.addEventListener('click', () => {
            if (event.target.classList.contains("edit") || event.target.classList.contains("trash")){
                return;
            }
            window.location.href = '/flashcard/' + item.querySelector(".flashcard_id").textContent;
        })
    })
};
const deleteFunc = async (item) => {
    const deleteObject = {
        id: userid,
        deleteId: item.parentNode.parentNode.parentNode.querySelector(".flashcard_id").textContent,
    };
    // Gửi yêu cầu DELETE
    await fetch("/api/flashcard-delete-list", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteObject),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Có lỗi xảy ra");
            }
            return response.json();
        })
        .then((data) => {
            let text = data.message;
            if (data.status == "error") {
                error(text);
            } else {
                success(text);
            }
        })
        .catch((error) => {
            console.error("Đã xảy ra lỗi:", error);
        });
        return true;
}
const removeEditListener = () => {
    editList.forEach((i) => {
        i.removeEventListener("click", getEditListFunc);
    })
}
btn2.addEventListener('click', () => {
    let checkDelete = deleteFunc(deleteStorage);
    if(checkDelete){
        popupAlert.style.display = 'none';
        popupOverlay.style.display = 'none';
        document.body.style.overflow = "auto";
        deleteFlashCardData();
        getTermData();
    } 
})
btn1.addEventListener('click', () => {
    popupAlert.style.display = 'none';
    popupOverlay.style.display = 'none';
    document.body.style.overflow = "auto";
    return;
})

const getFlashCardData = (data) => {
    var UrlCurrent = window.location.href;
    var flashcardList = document.querySelector(".flashcard_list");
    for (i = 0; i < data.length; i++) {
        if(!isNaN(parseInt(UrlCurrent.charAt(UrlCurrent.length - 1)))){
            if(data[i].Title_Id == modifiedString) continue;
        }
        var [flashcardId, flashcardListTitle, flashcardTotal, flashcardListTime] = createItem();
        flashcardId.textContent = data[i].Title_Id;
        flashcardListTitle.textContent = data[i].Name;
        flashcardTotal.textContent = data[i].TotalItem + " thuật ngữ";
        flashcardListTime.textContent = "Được tạo lúc: " + data[i].formated_time;
    }
    var checkFlashCard = document.querySelector(".flashcard_list--item");
    if(!checkFlashCard){
        flashcardList.querySelector("h1").style.display = 'none';
    }
    else{
        flashcardList.querySelector("h1").style.display = 'block';
    }
};
const deleteFlashCardData = () => {
    document.querySelectorAll(".flashcard_list--item").forEach((i) => {
        i.remove();
    })
    removeEditListener();
};
getTermData();

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