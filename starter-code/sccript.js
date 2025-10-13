//theme customiation
const theme = document.querySelector("#theme");
const main = document.querySelector("main");

const changeTheme = () => {
    main.classList.toggle("darkmode");
    const tog = theme.querySelector(".toggle");
    if (main.classList.contains("darkmode")) {
        tog.classList.add("dark")
        document.getElementById("sun").src = "./assets/images/icon-sun-light.svg"
        document.getElementById("moon").src = "./assets/images/icon-sun-light.svg"
    } else {
        tog.classList.remove("dark")
        document.getElementById("sun").src = "./assets/images/icon-sun-dark.svg"
        document.getElementById("moon").src = "./assets/images/icon-sun-dark.svg"
    }
}

theme.addEventListener("click", changeTheme)

//Variables

const selectedQuiz = document.querySelector(".subject-list");
const quizBtnContainer = document.querySelector("#subjects");
const quizCounter = document.querySelector("#counter");
const currentQuestion = document.querySelector("#question");
const progressBar = document.querySelector("#progression");
let solutions = document.querySelector("#solutions");
const total = document.querySelector("#score-container total");
const output = document.querySelector("#score-container output");
const submitBtn = document.querySelector("#submit");
const err = document.querySelector("#error-msg");

let quizzes;
let score = 0;
let questionIndex = 0;
let quizTitle = "html";
let currentSelected;
let shuffledQuestions = [];
let isSubmitted = false;
// let currentSelected = solutions.querySelector(".selected");


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
    console.log("Render quizes calledwith data:", quizzes);

    if (quizzes && quizzes.quizzes) {
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

        quiz.options.forEach((option) => {
            const listItem = document.createElement("li");
            const icon = document.createElement("span");
            const corr = document.createElement("em");
            const incorr = document.createElement("em");
            const para = document.createElement("p");
            para.textContent = option;
            listItem.append(icon, corr, incorr, para);
            listItem.classList.add("solution", "btn", "m-text-4");
            solutions.appendChild(listItem);
        });
    } else {
        console.error("Invalid data", quizzes);
    }

};

solutions.addEventListener("click", (e) => {
    handleSelected(e)
});

submitBtn.addEventListener("click", () => {
    if (!isSubmitted) {
        const quiz = shuffledQuestions[questionIndex];
        handleSubmit(quiz);
        submitBtn.textContent = "Next Question";
        isSubmitted = true;
    } else {
        nextQestion();
        submitBtn.textContent = "Submit Answer";
        isSubmitted = false;
        submitBtn.disabled = true;
    }
});

const nextQestion = () => {
    console.log("Next Question called");
    questionIndex++;
    if (questionIndex >= shuffledQuestions.length) {
        console.log("Quiz finished");
        return;
    }
    renderQuizzes(quizzes);
    submitBtn.textContent = "Submit Answer"
    solutions.style.pointerEvents = "auto";
    submitBtn.disabled = true;
};

const handleSelected = (e) => {
    const liEl = e.target.closest("LI") || e.target;

    if (liEl.tagName === "LI") {
        const currentSelected = solutions.querySelector(".selected");
        console.log(currentSelected);
        if (currentSelected) {
            currentSelected.classList.remove("selected");
        }
        liEl.classList.add("selected");
        submitBtn.disabled = false;
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
    currentSelected.classList.add("correct")

}

const handleIncorrect = () => {
    resetSelected()
    currentSelected.classList.add("incorrect")

}

const loadQuizzes = async () => {
    quizzes = await fetchQuizzes();
    const quizzesArray = quizzes.quizzes;
    getRandomQuestion(quizzesArray);
    renderQuizzes(quizzes);
}

loadQuizzes();


