require('dotenv').config();
const fetch = require('node-fetch');

function html(redirect) {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Redirecting...</title></head>
    <body>
        <script>
            window.location = '${redirect}';
        </script>
    </body>
    </html>`;
}

const handler = async (event) => {
    try {
        const path = event.path;
        const splat = path.replace(/\//,'');

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
            body: html(resultUrl),
            headers: {
                'Content-Type': 'text/html'
            }
        }
    } catch (error) {
        if (event.headers.cookie) {
            return { statusCode: 500, body: html('/p/dashboard')/*error.toString()*/ }
        }
        return { statusCode: 500, body: html('/p/sign-in')/*error.toString()*/ }
    }
}

module.exports = { handler }