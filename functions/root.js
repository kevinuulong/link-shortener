require('dotenv').config();

// NOTE: I don't think I need to bother with auth for this at the moment,
// but I may if I expand to supporting multiple domains.
const handler = async () => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: process.env.SHORT
    }
}

module.exports = { handler }