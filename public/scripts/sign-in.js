import { authenticate } from "./authenticate.js";

if (document.cookie != "") {
    const authed = async () => {
        if (await authenticate()) {
            window.location = '/p/dashboard';
        }
    }
    authed();
} else {
    console.log("Authentication failed");
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
    if (authKey != "") {
        document.cookie = `authToken=${authKey};path=/`;
        if (await authenticate()) {
            window.location = '/p/dashboard';
        }
    }
    document.querySelector("#authKey").value = '';
}
