require('dotenv').config();
const fetch = require('node-fetch');

const handler = async (event) => {
    try {
        console.log(event);
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

        const validToken = checkValidity.fields.Active;
        console.log(validToken);

        return {
            statusCode: 200,
            body: validToken ? validToken.toString() : validToken
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }

function parseCookie(cookies, cookieName) {
    var cookie = cookies.match(`${cookieName}=(..*?)(;|$)`)[1];
    return cookie;
}