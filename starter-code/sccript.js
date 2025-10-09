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

