const https = require('https');

async function getDataByUrl (url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const chunks = [];

            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        })
            .on('error', reject);
    });
}

module.exports = { getDataByUrl };