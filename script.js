const card = document.querySelector(".flip-card");
const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#back');
const btnExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const shuffleWords = document.querySelector('#shuffle-words');
const time = document.querySelector('#time');
let progress = 0;

const words = [
  {
    word: "Travel",
    translate: "Путешествие",
    example: "World travel gives people a new perspective",
  },
  {
    word: "Driving license",
    translate: "Водительские права",
    example: "Show me your driving license, please",
  },
  {
    word: "Flight mode",
    translate: "Режим полёта",
    example: "Please set your portable electronic devices, including any mobile phones, to flight mode",
  },
  {
    word: "Ticket office",
    translate: "Билетная касса",
    example: "Excuse me, where is the ticket office?",
  },
  {
    word: "Bill",
    translate: "Счёт",
    example: "Can I have the bill, please?",
  },
  {
    word: "Lifejacket",
    translate: "Спасательный жилет",
    example: "Your lifejacket is under your seat",
  },
];

const currentWords = [...words];

function makeCard({ word, translate, example }) {
  card.querySelector("#card-front h1").textContent = word;
  card.querySelector("#card-back h1").textContent = translate;
  card.querySelector("#card-back p span").textContent = example;
};

function renderCard(arr) {
  arr.forEach((item) => {
    makeCard(item);
  })
};

renderCard(currentWords);

function getRandomCard(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

shuffleWords.addEventListener('click', () => {
  makeCard(getRandomCard(currentWords));
});

function showProgress() {
  document.getElementById('words-progress').value = progress * 25;
  document.getElementById('current-word').textContent = progress + 1;
  makeCard(currentWords[progress]);
}

card.onclick = function () {
  card.classList.toggle('active');
};

btnNext.onclick = function () {
  progress = ++progress;
  btnBack.disabled = false;
  if (progress == 4) {
    btnNext.disabled = true;
  }
  showProgress();
}

btnBack.onclick = function () {
  progress = --progress;
  if (progress == 0) {
    btnBack.disabled = true;
  }
  if (progress < 5) {
    btnNext.disabled = false;
  }
  showProgress();
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

function makeExamCard(key) {
  let item = document.createElement("div");
  item.classList.add('card');
  item.textContent = key;
  return item;
};

function mixCards(arr) {
  let newArr = [];
  arr.forEach((item) => {
    newArr.push(makeExamCard(item.word));
    newArr.push(makeExamCard(item.translate));
  })
  return shuffle(newArr);
};

function renderExamCard(arr) {
  arr.forEach((item) => {
    examCards.append(item);
  })
};

let timer;
let sec = 0;
let min = 0;
let firstCard = 0;
let secondCard = 0;
let firstCardIndex = 0;
let secondCardIndex = 0;
let size = Object.keys(words).length;
let endIndex = 0
let click = false;

function showExamProgress(value) {
  let result = (100 * (value + 1)) / size;
  return Math.round(result);
}

btnExam.addEventListener('click', () => {
  card.classList.add('hidden');
  btnBack.classList.add('hidden');
  btnExam.classList.add('hidden');
  btnNext.classList.add('hidden');
  document.getElementById('study-mode').classList.add('hidden');
  document.getElementById('exam-mode').classList.remove('hidden');
  renderExamCard(mixCards(currentWords));

  timer = setInterval(() => {
    sec++;
    if (sec === 60) {
      sec = 0;
      min++
    }
    if (sec < 10) {
      time.textContent = `${min}:0${sec}`;
    }
    else {
      time.textContent = `${min}:${sec}`;
    }
  }, 1000)
})

examCards.addEventListener("click", (event) => {
  let card = event.target.closest(".card");
  if (click === false) {
    card.classList.add("correct");
    firstCard = card;
    firstCardIndex = currentWords.findIndex((item) => item.word === card.textContent);
    if (firstCardIndex === -1) {
      firstCardIndex = currentWords.indexOf((item) => item.translate === card.textContent);
    }
    click = true;
  } else if (click === true) {
    secondCard = card;
    secondCardIndex = currentWords.findIndex((item) => item.translate === card.textContent);

    if (secondCardIndex === -1) {
      secondCardIndex = currentWords.indexOf((item) => item.word === card.textContent);
    }

    if (firstCardIndex === secondCardIndex) {
      document.querySelector('#correct-percent').textContent = showExamProgress(endIndex) + '%';
      document.querySelector('#exam-progress').value = showExamProgress(endIndex);
      endIndex++;
      firstCard.classList.add("fade-out");
      secondCard.classList.add("correct");
      secondCard.classList.add("fade-out");

      if (endIndex === size) {
        clearInterval(timer);
        document.querySelector('.motivation').textContent = 'Поздравляю! Тестирование пройдено успешно!';
      }
      click = false;

    } else if (firstCardIndex !== secondCardIndex) {
      click = false;
      secondCard.classList.add("wrong");
      setTimeout(() => {
        firstCard.classList.remove("correct");
        secondCard.classList.remove("wrong");
      }, 500);
    }
  }
});