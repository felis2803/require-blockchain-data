const https = require('https');

const lastBlockUrl = 'https://blockchain.info/latestblock';
const blockUrlPart = 'https://blockchain.info/rawblock/';

async function getDataByUrl (url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const chunks = [];

            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        })
            .on('error', reject);
    });
}

async function getBlockByHash (hash) {
    const buffer = await getDataByUrl(blockUrlPart + hash);

    return JSON.parse(buffer);
}

async function getLastBlock () {
    const buffer   = await getDataByUrl(lastBlockUrl);
    const { hash } = JSON.parse(buffer);

    return getBlockByHash(hash);
}

module.exports = { getBlockByHash, getLastBlock };
