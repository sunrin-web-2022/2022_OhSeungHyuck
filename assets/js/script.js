
const container = document.querySelector(".card-game");

const time = 90;

// 뒷면에 넣을 특산물 배열
const specialtyArray = ["거제시_유자", "거제시_유자", "거창군_사과", "거창군_사과", "고성군_방울토마토", "고성군_방울토마토", "김해시_단감", "김해시_단감", "남해군_마늘", "남해군_마늘", "밀양시_대추", "밀양시_대추", "사천시_멸치", "사천시_멸치", "산청군_약초", "산청군_약초"];

const specialtyArray2 = ["양산시_매실", "양산시_매실", "의령군_수박", "의령군_수박", "진주시_고추", "진주시_고추", "창녕군_양파", "창녕군_양파", "창원시_풋고추", "창원시_풋고추", "통영시_굴", "통영시_굴", "하동군_녹차", "하동군_녹차", "함안군_곶감", "함안군_곶감", "함양군_밤", "함양군_밤", "합천군_돼지고기", "합천군_돼지고기"];

// 새로 시작할 때 돌릴 특산물 배열을 만듬
let specialtyArraySelect = specialtyArray.slice();

// 색상 배열에서 뽑은 색이 들어갈 배열
let specialty = [];

// 완성 카드
let successCards = [];

// 특산물을 셔플할 함수를 작성
const shuffle = () => {
    for (let i = 0; specialtyArraySelect.length > 0; i++) {
        specialty = specialty.concat(specialtyArraySelect.splice(Math.floor(Math.random() * specialtyArraySelect.length), 1));
    }
};

// 카드 만들기
const renderCards = () => {
    $(".card-game").find("div").remove();
    shuffle();
    for (let i = 0; i < 16; i++) {
        // 문서객체를 생성
        const card = document.createElement("div");
        const cardFront = document.createElement("div");
        const cardBack = document.createElement("div");

        // 생성한 문서객체에 클래스를 부여
        card.classList.add("card");
        card.setAttribute("data-name", `${specialty[i]}`);
        cardFront.classList.add("card-front");
        cardBack.classList.add("card-back");
        cardBack.setAttribute("data-name", `${specialty[i]}`);
        cardBack.setAttribute("data-location", `${specialty[i].split("_")[0]}`);

        // 문서객체를 추가하기
        container.appendChild(card);
        card.appendChild(cardFront);
        card.appendChild(cardBack);

        // 앞면에 카드 색 넣기
        const frontImg = document.createElement("img");
        frontImg.setAttribute("src", "./assets/images/event/card-background.jpg");
        cardFront.appendChild(frontImg);

        // 뒷면에 카드 색 넣기
        const backImg = document.createElement("img");
        backImg.setAttribute("src", `./assets/images/event/specialty/${specialty[i]}.jpg`);
        cardBack.appendChild(backImg);
    }
};

const hint = () => {
    const Cards = document.querySelectorAll(".card");
    // forEach 함수를 사용 카드 열기
    Cards.forEach((card, index) => {
        card.classList.add("flipped");
    });

    // 5초 후에 카드를 뒤집기
    Cards.forEach((card, _) => {
        setTimeout(() => {
            card.classList.remove("flipped");
        }, 3000);
    });
};

function paddedFormat(num) {
    return num < 10 ? "0" + num : num;
}

const remainTime = (duration) => {
    let parent = $(".remain-time span");
    let secondsRemaining = --duration;
    let min = 0;
    let sec = 0;
    let countInterval = setInterval(() => {
        min = parseInt(secondsRemaining / 60);
        sec = parseInt(secondsRemaining % 60);

        parent.text(`${paddedFormat(min)}분 ${paddedFormat(sec)}초`);

        secondsRemaining -= 1;
        if (secondsRemaining === 0) {
            clearInterval(countInterval);
        }
        console.log(secondsRemaining)
    }, 1000);
};

// 카드 세팅
const gameStart = () => {
    /* 
    처음에는 카드 외울시간을 부여하기위해
    forEach랑 setTimeout 함수를 사용
  */

    //-----------------처음 뒤집힘----------------------------

    // card들을 검색
    const Cards = document.querySelectorAll(".card");

    // 세팅중에는 클릭 안되게 설정
    let clickFlag = false;

    remainTime(5);

    // forEach 함수를 사용 카드 열기
    Cards.forEach((card, index) => {
        // setTimeout 함수를 사용
        setTimeout(() => {
            card.classList.add("flipped");
        }, 1000 + 100 * index);
    });

    // 5초 후에 카드를 뒤집기
    Cards.forEach((card, _) => {
        setTimeout(() => {
            card.classList.remove("flipped");
        }, 5000);
    });

    // 카드가 다 뒤집어지고 난 다음 true로 바꿔서 클릭이 되게 변경
    setTimeout(() => {
        clickFlag = true;
        remainTime(10);
    }, 5500);

    //-----------------처음 뒤집힘----------------------------

    // 카드가 두장 뒤집힐 때
    let cardArray = [];

    // toggle기능 부여
    Cards.forEach((card, _) => {
        card.addEventListener("click", () => {
            if (clickFlag && !successCards.includes(card)) {
                // 여기서 includes는 배열 속에 해당 원소가 있으면 true 없으면 false를 반환한다.
                card.classList.toggle("flipped");
                // 클릭할 때 그 카드를 배열에 담음
                cardArray.push(card);
                // 카드가 2장 뒤집었을 때
                if (cardArray.length === 2) {
                    // 그 카드의 색상을 변수에 담음
                    let cardA = cardArray[0].querySelector(".card-back").dataset["name"];
                    let cardB = cardArray[1].querySelector(".card-back").dataset["name"];

                    // 두 카드의 색이 같다면
                    if (cardA == cardB) {
                        // 완성카드에 추가한다.
                        successCards.push(cardArray[0]);
                        successCards.push(cardArray[1]);

                        findCardCount = successCards.length / 2;
                        $(".find-card-count span").text(findCardCount);
                        // 다음 검사를 위해 배열 비워줌
                        cardArray = [];

                        // 게임 초기화

                        // 성공카드배열의 길이가 16일 때
                        if (successCards.length == 16) {
                            // 성공카드 배열 비우고
                            successCards = [];

                            // 특산물 비우고
                            specialty = [];

                            // 랜덤으로 카드 돌릴꺼 다시 만들고
                            specialtyArraySelect = specialtyArray.slice();

                            renderCards();
                        }

                        // 두 카드의 색이 다르다면
                    } else {
                        // 다시 뒤집을 것이다.

                        // 그 때 또 클릭을 할 수 있기 때문에 flag를 다시 false로 바꿈
                        clickFlag = false;

                        setTimeout(() => {
                            // 뒤집기 위해 클래스 빼주고
                            cardArray[0].classList.remove("flipped");
                            cardArray[1].classList.remove("flipped");

                            // 다시 true로 바꾸고
                            clickFlag = true;

                            // 배열 비워줌
                            cardArray = [];
                        }, 1000);
                    }
                }
            }
        });
    });
};

$("#play-card-game").click(() => {
    $("#play-card-game").text("다시하기");
    renderCards();
    gameStart();
});
$("#hint-card-game").click(() => {
    hint();
});

renderCards();
