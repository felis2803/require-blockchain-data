const { explorers, EXPLORER_NAMES } = require('./explorers');
const { getDataByUrl }              = require('./get-data-by-url');
const { Block }                     = require('./block');

const explorer = explorers[EXPLORER_NAMES.blockcypher];

async function getBlockByHash (hashOrHeight) {
    const buffer = await getDataByUrl(explorer.blockRest + hashOrHeight + '?limit=1');

    return new Block(JSON.parse(buffer), explorer);
}

async function getLastBlock () {
    const buffer = await getDataByUrl(explorer.statsRest);
    const hash   = explorer.extractLastBlockHash(buffer);

    return getBlockByHash(hash);
}

module.exports = { getBlockByHash, getLastBlock };
