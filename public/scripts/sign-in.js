import { authenticate } from "./authenticate.js";

if (document.cookie != "") {
    console.log("Hello, cookies!");
    const authed = async () => {
        if (await authenticate()) {
            console.log("Hello, authentication!");
            window.location = '/p/dashboard';
        }
    }
    authed();
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


async function signIn() {
    var authKey = document.querySelector("#authKey").value;
    document.querySelector("#authKey").value = '';
    if (authKey != "") {
        document.cookie = `authToken=${authKey};path=/`;
        if (await authenticate()) {
            console.log("Hello, authentication!");
            window.location = '/p/dashboard';
        }
    }
}
