require('dotenv').config();
const fetch = require('node-fetch');
const url = require('url');

const handler = async (event) => {
    if (await authenticate(event)) {
        try {
            const records = await fetch(`https://api.airtable.com/v0/${process.env.BASE}/Redirects?view=Grid%20view`, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
                }
            })
                .then(res => res.json())
                .then(result => result.records)

            // let links = {};

            // records.forEach(record => {
            //     links[record.fields.Splat] = record.fields.Redirect;
            // });

            let links = records;

            return {
                statusCode: 200,
                body: JSON.stringify(links),
                headers: {
                    'Content-Type': 'application/json'
                }
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
    const authed = await fetch(`${destination.protocol}//${destination.host}/api/authentication`, {
        headers: {
            cookie: event.headers.cookie
        }
    })
        .then(res => res.json())
    return authed;
}

module.exports = { handler }