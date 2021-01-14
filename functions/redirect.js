require('dotenv').config()
var Airtable = require('airtable');
var base = new Airtable({ apiKey: `${process.env.AIRTABLE_API_KEY}` }).base(process.env.BASE);

const handler = async (event) => {
    try {
        const payload = JSON.parse(event.body);
        var splat = payload.splat;
        console.log(splat);
        console.log(`DATA: ${redirect(splat)}`)
        return {
            statusCode: 200,
            body: redirect(splat)
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }

function redirect(splat) {
    base('Redirects').select({
        filterByFormula: `{Splat} = '${splat}'`
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
            console.log('Retrieved', record.get('Splat'));
            console.log(record.get('Redirect'));
            return record.get('Redirect');
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}