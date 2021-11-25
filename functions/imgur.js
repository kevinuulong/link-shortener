require('dotenv').config();
const fetch = require('node-fetch');
const url = require('url');

const handler = async (event, context) => {
    event.body = JSON.parse(event.body);
    if (await authenticate(event)) {
        if (event.body.clientId) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: process.env.IMGUR_CLIENT_ID
            }
        }
        if (event.body.accessToken) {
            try {
                let access_token = await fetch('https://api.imgur.com/oauth2/token', {
                    method: 'POST',
                    body: JSON.stringify({
                        refresh_token: parseCookie(event.headers.cookie, imgurRefreshToken),
                        client_id: process.env.IMGUR_CLIENT_ID,
                        client_secret: process.env.IMGUR_CLIENT_SECRET,
                        grant_type: 'refresh_token'
                    })
                })
                    .then(res => res.json)
                    .then(res => res.access_token)

                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: access_token
                }
            } catch (error) {
                return { statusCode: 500 }
            }
        }
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain'
            }
        }


    } else {
        console.log("Not authed");
        return { statusCode: 401 }
    }
}

module.exports = { handler }

async function authenticate(event) {
    let destination = url.parse(event.rawUrl, true);
    const authed = await fetch(`${destination.protocol}//${destination.host}/api/authentication`, {
        headers: {
            cookie: event.headers.cookie
        }
    })
        .then(res => res.json())
    return authed;
}

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}