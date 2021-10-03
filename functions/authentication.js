require('dotenv').config();
const fetch = require('node-fetch');

const handler = async (event) => {
    try {
        const authToken = parseCookie(event.headers.cookie, "authToken");

        const checkValidity = await fetch(`https://api.airtable.com/v0/${process.env.BASE}/Tokens?maxRecords=1&filterByFormula={authToken}='${authToken}'`, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
        })
            .then(res => res.json())
            .then(result => result.records[0])
            .catch(err => console.error(err))

        const validToken = checkValidity.fields.Active ? checkValidity.fields.Active: false;

        return {
            statusCode: 200,
            body: validToken.toString()
        }
    } catch (error) {
        console.log(error);
        return { statusCode: 200, body: "false" }
    }
}

module.exports = { handler }

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}