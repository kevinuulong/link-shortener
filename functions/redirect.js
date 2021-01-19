require('dotenv').config();
const fetch = require('node-fetch');

const handler = async (event) => {
    try {
        const payload = JSON.parse(event.body);
        var splat = payload.splat;

        const url = await fetch(`https://api.airtable.com/v0/${process.env.BASE}/Redirects?maxRecords=1&filterByFormula={Splat}='${splat}'`, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
        })
            .then(res => res.json())
            .then(result => result.records[0])

        const resultUrl = url.fields.Redirect;

        return {
            statusCode: 200,
            body: resultUrl
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }