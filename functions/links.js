require('dotenv').config();
const fetch = require('node-fetch');
const url = require('url');

const handler = async (event) => {
    console.log(event);
    if (await authenticate(event)) {
        console.log("Authed");
    } else {
        console.log("Not authed");
    }
    try {
        const records = await fetch(`https://api.airtable.com/v0/${process.env.BASE}/Redirects`, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
        })
            .then(res => res.json())
            .then(result => result.records)

        let links = {};

        records.forEach(record => {
            links[record.fields.Splat] = record.fields.Redirect;
        });

        // const resultUrl = url.fields.Redirect;

        return {
            statusCode: 200,
            body: JSON.stringify(links),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    } catch (error) {
        if (event.headers.cookie) {
            return { statusCode: 404, body: html('/p/dashboard')/*error.toString()*/ }
        }
        return { statusCode: 404, body: html('/p/sign-in')/*error.toString()*/ }
    }
}

async function authenticate(event) {
    let destination = url.parse(event.rawUrl, true);
    const authed = await fetch(`${destination.protocol}//${destination.host}/api/authentication`, {
        headers: event.headers
    })
        .then(res => res.text())
    return authed;
}

module.exports = { handler }