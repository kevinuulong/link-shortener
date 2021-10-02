import { authenticate } from "./authenticate.js";

if (document.cookie != "") {
    const authed = async () => {
        if (await authenticate()) {
            console.log("Hello, authentication!");
        } else {
            window.location = '/p/sign-in';
        }
    }
    authed();
} else {
    window.location = '/p/sign-in';
}