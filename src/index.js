const https = require('https');

const { EXPLORER_URLS } = require('./const');
const { Block }         = require('./block');

const currentExplorerUrl = EXPLORER_URLS.blockchainInfo

const lastBlockUrl = `${currentExplorerUrl}/latestblock`;
const blockPartUrl = `${currentExplorerUrl}/rawblock/`;

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

async function getBlockByHash (hash) {
    const buffer = await getDataByUrl(blockPartUrl + hash);

    return new Block(JSON.parse(buffer), currentExplorerUrl);
}

async function getLastBlock () {
    const buffer   = await getDataByUrl(lastBlockUrl);
    const { hash } = JSON.parse(buffer);

    return getBlockByHash(hash);
}

module.exports = { getBlockByHash, getLastBlock };
