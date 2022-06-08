const EXPLORER_NAMES = {
    blockchainInfo: 'blockchain.info',
    blockcypher:    'blockcypher',
}

const DEFAULT_FILD_NAME_EQUIVALENTS = {
    version:    'ver',
    prevHash:   'prev_block',
    merkleRoot: 'mrkl_root',
}

const explorers = {
    [EXPLORER_NAMES.blockchainInfo]: {
        url:  'https://blockchain.info',
        doc:  'https://blockchain.com/api',

        statsRest: 'https://blockchain.info/q/latesthash',
        blockRest: 'https://blockchain.info/rawblock/',

        extractLastBlockHash: buffer => buffer.toString(),

        filedNameEquivalents: DEFAULT_FILD_NAME_EQUIVALENTS,
    },

    [EXPLORER_NAMES.blockcypher]: {
        url:  'https://blockcypher.com',
        doc:  'https://blockcypher.com/dev/',

        statsRest: 'https://api.blockcypher.com/v1/btc/main',
        blockRest: 'https://api.blockcypher.com/v1/btc/main/blocks/',

        extractLastBlockHash: buffer => JSON.parse(buffer.toString()).hash,

        filedNameEquivalents: DEFAULT_FILD_NAME_EQUIVALENTS,
    },
};

module.exports = { explorers, EXPLORER_NAMES };
