import { authenticate } from "./authenticate.js";

if (document.cookie != "") {
    console.log("Hello, cookies!");
    // var authed = async () => await authenticate();
    // console.log(async () => await authenticate());
    const authed = async () => {
        if (await authenticate()) {
            console.log("Hello, authentication!")
        }
    }
    console.log(authed)
} else {
    console.log("Hello, world!");
}

document.querySelector("#signInBtn").addEventListener('click', signIn);
document.querySelector("#authKey").addEventListener('keydown', (e) => {
    if (e.which === 13) {
        e.preventDefault();
        signIn();
    }
})


function signIn() {
    var authKey = document.querySelector("#authKey").value;
    document.querySelector("#authKey").value = '';
    if (authKey != "") {
        document.cookie = `authToken=${authKey}`;
        console.log(authenticate());
    }
}

// console.log(getCookie('authToken'));
// console.log(getCookie('_ga'));