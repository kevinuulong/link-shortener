import { authenticate } from "./authenticate.js";

let authed = false;
if (document.cookie != "") {
    const checkAuth = async () => {
        if (await authenticate()) {
            console.log("Hello, authentication!");
            authed = true;
            let links = await getLinks();
            populateLinks(links);
        } else {
            window.location = '/p/sign-in';
        }
    }
    checkAuth();
} else {
    window.location = '/p/sign-in';
}

async function getLinks() {
    const links = await fetch('/api/links')
        .then(res => res.json())
    return links;
}

async function shorten(link, slug = "") {
    const links = await fetch('/api/shorten', {
        method: 'POST',
        body: JSON.stringify({
            redirect: link
        })
    })
        .then(res => res.text())
    return links;
}

document.getElementById("shortenBtn").addEventListener('click', async () => {
    let url = document.getElementById("shortenUrl").value;
    let short = await shorten(url);
    let displayLink = document.getElementById("displayLink");
    navigator.clipboard.writeText(short)
    .then(toast("Short link successfully copied to your clipboard!"))
    displayLink.textContent = short;
})

function toast(message) {
    let toast = document.createElement('p');
    toast.classList.add('toast');
    let toastMessage = document.createTextNode(message);
    toast.appendChild(toastMessage);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, toast.textContent.length * 75);
}

function populateLinks(data) {
    let linkList = document.getElementById("linkList");

    Object.keys(data).forEach(splat => {
        let target = document.createElement('a');
        target.classList.add('target');
        target.href = data[splat];
        target.textContent = data[splat];

        let arrow = document.createElement('i');
        arrow.classList.add('material-icons-round', 'icon');
        arrow.textContent = 'arrow_right_alt';

        let slug = document.createElement('p');
        slug.classList.add('slug')
        slug.textContent = splat;

        let link = document.createElement('div');
        link.classList.add('link');
        link.appendChild(slug);
        link.appendChild(arrow);
        link.appendChild(target);

        linkList.appendChild(link);
    });
}