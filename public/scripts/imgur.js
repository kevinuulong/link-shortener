if (!document.cookie.includes('imgurAccessToken')) {
    imgurAuth();
}


function imgurAuth() {
    let params = new URLSearchParams(window.location.search)

    if (params.has('refresh_token')) {
        // Expires after 5 years (arbitrary deadline):
        document.cookie += `imgurRefreshToken=${params.get('refresh_token')};path=/;max-age=${60 * 60 * 24 * 30 * 12 * 5}`;
    } else {
        fetch('../api/imgur', {
            method: 'POST',
            body: JSON.stringify({
                clientId: true
            })
        })
            .then(res => res.text())
            .then(res => {
                window.location.replace(`https://api.imgur.com/oauth2/authorize?client_id=${res}&response_type=token&state=imgur_auth`)
            })
    }

    if (params.has('access_token')) {
        // Expires after a month as per Imgur's requirements:
        document.cookie += `imgurAccessToken=${params.get('access_token')};path=/;max-age=${60 * 60 * 24 * 30}`;
    } else {
        fetch('../api/imgur', {
            method: 'POST',
            body: JSON.stringify({
                accessToken: true
            })
        })
            .then(res => res.text())
            .then(res => {
                document.cookie += `imgurAccessToken=${res};path=/;max-age=${60 * 60 * 24 * 30}`;
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
            'Authorization': `Client-ID ${parseCookie(document.cookie, 'imgurAccessToken')}`
        }
    })
        .then(res => res.json())
        .then(res => console.log(res))
})

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}
