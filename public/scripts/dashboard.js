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
            redirect: link,
            splat: slug
        })
    })
        .then(res => res.json())
    return links;
}

async function update(link, slug, id) {
    const links = await fetch('/api/update', {
        method: 'PATCH',
        body: JSON.stringify({
            redirect: link,
            splat: slug,
            id: id
        })
    })
        .then(res => res.json())
    return links;
}

document.getElementById("shortenBtn").addEventListener('click', async () => {
    let url = document.getElementById("shortenUrl").value;
    let shortened = await shorten(url);
    let short = new URL(shortened.url);
    displayShort(short, shortened.fields.Redirect, shortened.id);
    editLink(url, short)
})

document.querySelector("#displayOptions > i:nth-child(1)").addEventListener('click', async () => {
    let url = document.querySelector("#target").value;
    let slug = document.querySelector("#slug").value;
    let id = document.querySelector("#displayLink").dataset.recId;
    let updated = await update(url, slug, id);
    let short = new URL(updated.url);
    displayShort(short, updated.fields.Redirect, updated.id);
    editLink(url, short)
})

document.querySelector("#displayOptions > i:nth-child(2)").addEventListener('click', () => {
    let short = document.getElementById("displayLink").textContent;
    navigator.clipboard.writeText(short)
        .then(toast("Short link successfully copied to your clipboard!"))
})

function editLink(target, slug) {
    document.getElementById("target").value = target;
    document.getElementById("slug").value = slug.pathname.replace(/\//, '');
}

function displayShort(short, url, id) {
    let displayLink = document.getElementById("displayLink");
    displayLink.dataset.recId = id;
    navigator.clipboard.writeText(short)
        .then(toast("Short link successfully copied to your clipboard!"))
    displayLink.textContent = short;
    populateLink(short.pathname.replace(/\//, ''), url, id);
}

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
    data.forEach(record => {
        // links[record.fields.Splat] = record.fields.Redirect;
        populateLink(record.fields.Splat, record.fields.Redirect, record.id)
    });
    // Object.keys(data).forEach(splat => {
    //     populateLink(splat, data[splat])
    // });
}

function populateLink(splat, destination, id) {
    let linkList = document.getElementById("linkList");
    let target = document.createElement('a');
    target.classList.add('target');
    target.href = destination;
    target.textContent = destination;

    let arrow = document.createElement('i');
    arrow.classList.add('material-icons-round', 'icon');
    arrow.textContent = 'arrow_right_alt';

    let slug = document.createElement('p');
    slug.classList.add('slug')
    slug.textContent = splat;

    let link;
    if (document.getElementById(id)) {
        link = document.getElementById(id);
        link.textContent = "";
        link.appendChild(slug);
        link.appendChild(arrow);
        link.appendChild(target);
        link.addEventListener('click', editLinkClick(splat, destination, id))

    } else {
        link = document.createElement('div');
        link.classList.add('link');
        link.id = id;
        link.appendChild(slug);
        link.appendChild(arrow);
        link.appendChild(target);
        link.addEventListener('click', () => { editLinkClick(splat, destination, id) })

        // Display links in order of most recently created:
        linkList.insertBefore(link, linkList.childNodes[0] || null);
    }

}

async function editLinkClick(splat, destination, id) {
    document.getElementById("target").value = destination;
    document.getElementById("slug").value = splat;
    document.getElementById("displayLink").dataset.recId = id;
    // NOTE: This no longer makes as many API requests but I am still not fully satisfied with it:
    document.getElementById("displayLink").textContent = `https://${document.getElementById("linkBase").textContent}/${splat}`;
}

root();

async function root() {
    const root = await fetch('/api/root')
        .then(res => res.text())
    document.getElementById("linkBase").textContent = root;
}