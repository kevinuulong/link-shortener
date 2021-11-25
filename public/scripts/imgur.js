if (window.location.hash) {
    window.history.replaceState('', '', window.location.href.replace(/#/, '?'))
    imgurAuth();
}
if (!document.cookie.includes('imgurAccessToken')) {
    imgurAuth();
}



function imgurAuth() {
    let params = new URLSearchParams(window.location.search)

    if (params.has('refresh_token')) {
        // Expires after 5 years (arbitrary deadline):
        document.cookie = `imgurRefreshToken=${params.get('refresh_token')};path=/;max-age=${60 * 60 * 24 * 30 * 12 * 5}`;
    } else {
        fetch('../api/imgur', {
            method: 'POST',
            body: JSON.stringify({
                clientId: true
            })
        })
            .then(res => res.text())
            .then(res => {
                window.location.replace(`https://api.imgur.com/oauth2/authorize?client_id=${res}&response_type=token`);
            })
    }

    if (params.has('access_token')) {
        // NOTE: Expires after a month as per Imgur's requirements:
        // Not very well documented but it seems like Imgur may consider a month 28 days.
        document.cookie = `imgurAccessToken=${params.get('access_token')};path=/;max-age=${60 * 60 * 24 * 28}`;
    } else {
        fetch('../api/imgur', {
            method: 'POST',
            body: JSON.stringify({
                accessToken: true
            })
        })
            .then(res => res.text())
            .then(res => {
                document.cookie = `imgurAccessToken=${res};path=/;max-age=${60 * 60 * 24 * 28}`;
            })
    }
}

// Imgur Upload:
document.getElementById('image').addEventListener('change', (e) => {
    e.preventDefault();
    let image = e.target.files[0];
    let formData = new FormData().append('image', image)
    fetch('https://api.imgur.com/3/upload', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${parseCookie(document.cookie, 'imgurAccessToken')}`
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
})

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}
