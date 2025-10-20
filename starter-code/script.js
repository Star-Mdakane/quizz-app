const selectedQuiz = document.querySelector("#sub-quiz");
const subIcon = document.querySelector("#sub-icon");
const quizBtnContainer = document.querySelector("#subjects");
const quizCounter = document.querySelector("#counter");
const currentQuestion = document.querySelector("#question");
const progressBar = document.querySelector("#progression");
const submitBtn = document.querySelector("#submit");
let solutions = document.querySelector("#solutions");
let total = document.querySelector(".total");
let output = document.querySelector("#outp");
// const err = document.querySelector("#error-msg");
let menuPage = document.querySelector(".contaier-menu");
let questionsPage = document.querySelector(".container-questions");
let scorePage = document.querySelector(".complete-container");

let quizzes;
let score = 0;
let questionIndex = 0;
let currentSelected;
let shuffledQuestions = [];
let isSubmitted = false;
let currentSubject;
let quizTitle = "html";

//theme customiation
const theme = document.querySelector("#theme");
const main = document.querySelector("main");
let darkmode = localStorage.getItem("darkmode");

const enableDarkmode = () => {
    main.classList.add("darkmode");
    const tog = theme.querySelector(".toggle");
    tog.classList.add("dark");
    localStorage.setItem("darkmode", "active");
    document.getElementById("sun").src = "./assets/images/icon-sun-light.svg"
    document.getElementById("moon").src = "./assets/images/icon-moon-light.svg"
}

const disableDarkmode = () => {
    main.classList.remove("darkmode");
    const tog = theme.querySelector(".toggle");
    tog.classList.remove("dark");
    localStorage.removeItem("darkmode");
    document.getElementById("sun").src = "./assets/images/icon-sun-dark.svg"
    document.getElementById("moon").src = "./assets/images/icon-moon-dark.svg"
}

if (darkmode === "active") enableDarkmode();

const changeTheme = () => {
    darkmode = localStorage.getItem("darkmode");
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
}

if (theme) {
    theme.addEventListener("click", changeTheme);
} else {
    console.error("theme not found");
}



function renderScoreCards() {
    const scores = JSON.parse(localStorage.getItem('scores')) || {};
    const scoreCardTemplate = document.querySelector('.score-card');

    scoreCardTemplate.style.display = 'none';

    const scoreCardContainer = scoreCardTemplate.parentNode;

    scoreCardContainer.querySelectorAll('.score-card:not([style*="display: none"])');

    Object.keys(scores).forEach((subject, index) => {
        const newScoreCard = scoreCardTemplate.cloneNode(true);
        newScoreCard.style.display = 'block';

        if (index > 0) {
            scoreCardTemplate.parentNode.appendChild(newScoreCard);
        } else {
            scoreCardTemplate.parentNode.insertBefore(newScoreCard, scoreCardTemplate);
        }

        generateScoreCard(subject, scores[subject], newScoreCard);
    });
}

const generateScoreCard = (subject, scores, scoreCard) => {
    const scoreTitle = scoreCard.querySelector('#score-title');
    const scoreList = scoreCard.querySelector('#score-list');

    scoreTitle.textContent = subject;
    scoreList.innerHTML = '';

    scores.forEach((score) => {
        const scoreItem = document.createElement('li');
        scoreItem.classList.add('rank');
        scoreItem.innerHTML = `
      <p class="name"> ${score.name}</p>
      <p class="s-score"> ${score.score}</p>
    `;
        scoreList.appendChild(scoreItem);
    });
};

function saveScore(name, score) {
    console.log('Saving score...');
    const subject = quizTitle;
    const scores = JSON.parse(localStorage.getItem('scores')) || {};
    if (!scores[subject]) {
        scores[subject] = [];
    }
    scores[subject].push({ name, score });
    scores[subject] = scores[subject].slice(0, 5);;
    localStorage.setItem('scores', JSON.stringify(scores));
}

const saveScoreButton = document.querySelector('.saveScore');
if (saveScoreButton) {
    saveScoreButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Save button clicked');
        const name = document.querySelector('#name').value;
        const totalElement = document.querySelector('.total');
        const score = totalElement ? totalElement.textContent : '';
        const subject = quizTitle;

        if (name !== '' && score !== '' && subject !== '') {
            document.querySelector('#name-error').setAttribute('hidden', true);
            console.log('Quiz Title:', quizTitle);
            saveScore(name, score);
            renderScoreCards();
            document.querySelector('form').reset();
            scoreContainer.style.display = 'flex';
            wrapper.style.display = 'none';
        } else {
            document.querySelector('#name-error').removeAttribute('hidden');
        }
        document.querySelectorAll('button').forEach((button) => {
            button.disabled = false;
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        renderScoreCards();
    });
} else {
    console.error('Save score button not found');
}

//functions

//Will be used to get random queston
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//fechQuizzes uses the fetch API to get the json data and make use of it as an object
const fetchQuizzes = async () => {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error(`HTTP error!: ${response.status}`);
        const quizzes = await response.json();
        return quizzes;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getRandomQuestion = (quizzesArray) => {
    const quiz = quizzesArray.find((quiz) => quiz.title.toLowerCase() === quizTitle.toLowerCase());
    if (!quiz) return [];
    shuffledQuestions = shuffle(quiz.questions);
    return shuffledQuestions;
};

const renderQuizzes = (quizzes) => {

    if (quizzes && quizzes.quizzes) {
        submitBtn.style.display = "none";
        if (shuffledQuestions.length === 0) {
            getRandomQuestion(quizzes.quizzes);
        }

        const quiz = shuffledQuestions[questionIndex];
        solutions.innerHTML = '';


        if (shuffledQuestions.length > 0) {
            currentQuestion.textContent = quiz.question;
        } else {
            currentQuestion.textContent = "No questions found";
        }

        shuffle(quiz.options).forEach((option) => {

            const listItem = document.createElement("li");
            const corr = document.createElement("em");
            const image = document.createElement("img");
            image.classList.add("corrIcon");
            const para = document.createElement("p");
            corr.appendChild(image);
            para.textContent = option;
            listItem.append(corr, para);
            listItem.classList.add("solution", "btn", "m-text-4");
            solutions.appendChild(listItem);
        });

        const questionCount = questionIndex + 1;
        progressBar.value = questionCount;
        quizCounter.textContent = `Question ${questionCount} of 10`;
        // err.style.display = "none";
    } else {
        console.error("Invalid data", quizzes);
    }
};

quizBtnContainer.querySelectorAll(".subject").forEach((sub) => {
    sub.addEventListener("click", (e) => {
        selectSubject(e)
    })
})

const handleTotal = () => {
    if (score) {
        total.textContent = score;
        document.querySelector('form').style.display = 'none';
    }

    if (score < 3) {
        output.textContent = "Where you even trying?";
    } else if (score < 6) {
        output.textContent = "With a little more practice, you will eventually get there";
        document.querySelector('form').style.display = 'none';
    } else {
        output.textContent = "You should consider a career in programming";
        document.querySelector('form').style.display = 'block';
        document.querySelector('form').classList.remove('hidden');
        if (scorePage.style.display === 'grid' && document.querySelector('form').style.display === 'grid') {
            submitBtn.disabled = true;
        }
    }
}

solutions.addEventListener("click", (e) => {
    handleSelected(e)
});

submitBtn.addEventListener("click", () => {
    currentSelected = solutions.querySelector(".selected");
    if (!isSubmitted) {
        if (currentSelected) {
            const quiz = shuffledQuestions[questionIndex];
            handleSubmit(quiz);
            submitBtn.textContent = "Next Question";
            isSubmitted = true;
            // err.style.display = "none"
        } else {
            // err.style.display = "flex"
        }
    } else {
        submitBtn.textContent = "Submit Answer";
        isSubmitted = false;
        submitBtn.disabled = true;
        submitBtn.classList.add("no-sel");
        nextQuestion();
    }
});

const nextQuestion = () => {

    questionIndex++;
    if (questionIndex >= shuffledQuestions.length) {
        console.log("Quiz finished");
        questionsPage.style.display = "none";
        scorePage.style.display = 'grid';
        submitBtn.disabled = true;
        saveScoreButton.disabled = false;
        document.querySelectorAll('button:not(.saveScore)').forEach((button) => {
            button.disabled = true;
        });
        submitBtn.textContent = "Play Again";
        submitBtn.disabled = false;
        submitBtn.style.display = "block";
        submitBtn.classList.remove('no-sel');
        submitBtn.addEventListener("click", newGame);
        return;
    }

    renderQuizzes(quizzes);
    submitBtn.style.display = "block";
    submitBtn.textContent = "Submit Answer"
    solutions.style.pointerEvents = "auto";
    submitBtn.disabled = true;
    submitBtn.classList.add("no-sel");
};

const newGame = () => {
    score = 0;
    questionIndex = 0;
    scorePage.style.display = "none";
    menuPage.style.display = "grid";
    submitBtn.textContent = "Play Again";
    submitBtn.style.display = "none";
    if (submitBtn.textContent === "Play Again") {
        submitBtn.disabled = true;
    }
    submitBtn.removeEventListener("click", newGame)
    document.querySelectorAll('button').forEach((button) => {
        button.disabled = false;
    });
};

const selectSubject = (e) => {

    const subBtn = e.target.closest(".subject") || e.target;
    const subValue = subBtn.id;
    quizTitle = subValue;
    quiz = quizzes.quizzes.find(q => q.title.toLowerCase() === quizTitle.toLowerCase());
    currentSubject = quizTitle;
    selectedQuiz.textContent = quiz.title;
    subIcon.src = quiz.icon;
    questionIndex = 0;
    getRandomQuestion(quizzes.quizzes);
    renderQuizzes(quizzes);
    menuPage.style.display = "none";
    questionsPage.style.display = "grid";
    submitBtn.style.display = "block";

}

const handleSelected = (e) => {
    const liEl = e.target.closest("LI") || e.target;

    if (liEl.tagName === "LI") {
        if (currentSelected) {
            currentSelected.classList.remove("selected");
        }
        console.log(currentSelected);
        liEl.classList.add("selected");
        currentSelected = liEl;
        submitBtn.classList.remove("no-sel");
        submitBtn.disabled = false;
        // err.style.display = "none";
    }
}

const handleSubmit = (quiz) => {
    currentSelected = solutions.querySelector(".selected")
    const correctOption = quiz.answer;
    if (currentSelected) {
        const selectedOption = currentSelected.querySelector("p").textContent;
        const isCorrect = selectedOption.toLowerCase() === correctOption.toLowerCase();
        isCorrect ? handleCorrect() : handleIncorrect();
        solutions.querySelectorAll(".solution").forEach(option => option.style.pointerEvents = "none");

    }
}

const resetSelected = () => {
    currentSelected.classList.remove("selected");
}

const handleCorrect = () => {
    resetSelected()

    currentSelected.classList.add("correct");
    const imgEl = currentSelected.querySelector("em img");
    imgEl.src = "./assets/images/icon-correct.svg"
    score++;
    handleTotal();

    return score;
}

const handleIncorrect = () => {
    resetSelected()
    currentSelected.classList.add("incorrect");
    const imgEl = currentSelected.querySelector("em img");
    imgEl.src = "./assets/images/icon-incorrect.svg"
}

const loadQuizzes = async () => {
    quizzes = await fetchQuizzes();
    const quizzesArray = quizzes.quizzes;
    getRandomQuestion(quizzesArray);
    renderQuizzes(quizzes);
}

loadQuizzes();

const scoreContainer = document.getElementById('s-container');
const wrapper = document.querySelector('.wrapper');
const scoresheetButton = document.getElementById('scoresheet');

scoreContainer.style.display = 'none';

scoresheetButton.addEventListener('click', () => {
    toggleScoreContainer();
});

function toggleScoreContainer() {
    if (scoreContainer.style.display === 'flex') {
        scoreContainer.style.display = 'none';
        wrapper.style.display = 'grid';
        scoresheetButton.innerHTML = `
        <span class="material-symbols-rounded">
          leaderboard
        </span>
        <h2 class="m-text-4">Scores</h2>
        `;
    } else {
        scoreContainer.style.display = 'flex';
        wrapper.style.display = 'none';
        scoresheetButton.innerHTML = `
        <span class="material-symbols-rounded">
          Home
        </span>
        <h2 class="m-text-4">Home</h2>
        `;
    }
}
