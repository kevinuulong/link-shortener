require('dotenv').config();
const fetch = require('node-fetch');
const url = require('url');

const handler = async (event) => {
    event.body = JSON.parse(event.body);
    if (await authenticate(event)) {
        try {
            console.log(event.body.id)
            const short = await fetch(`https://api.airtable.com/v0/${process.env.BASE}/Redirects/${event.body.id}`, {
                method: 'PATCH',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
                },
                body: JSON.stringify({
                    "fields": {
                        "Splat": event.body.splat,
                        "Redirect": event.body.redirect
                    }
                })
            })
                .then(res => res.json())
            console.log(short);
            short.url = `https://${process.env.SHORT}/${short.fields.Splat}`
            

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(short)
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    } else {
        console.log("Not authed");
        return { statusCode: 401 }
    }
}

async function authenticate(event) {
    let destination = url.parse(event.rawUrl, true);
    console.log(event.headers,destination);
    const authed = await fetch(`${destination.protocol}//${destination.host}/api/authentication`, {
        headers: {
            cookie: event.headers.cookie
        }
    })
        .then(res => res.json())
    return authed;
}

module.exports = { handler }