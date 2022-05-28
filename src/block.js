const { createHash } = require('crypto');

const { EXPLORER_URLS } = require("./const");

const FIELD_NAME_EQUIVALENTS = {
    [EXPLORER_URLS.blockchainInfo]: {
        version:    'ver',
        prevHash:   'prev_block',
        merkleRoot: 'mrkl_root',
    },
}

class InvalidBlockError extends Error {
    constructor (sourceHash, calculatedHash, block) {
        const message = InvalidBlockError.formatError(sourceHash, calculatedHash);

        super(message);

        this.sourceHash     = sourceHash;
        this.calculatedHash = calculatedHash;
        this.block          = block;
        this.rawBlock       = block.rawBlock;
        this.explorerName   = block.explorerName;
    }

    static formatError (sourceHash, calculatedHash) {
        return 'The block is invalid: the computed hash does not match the received one.\n' +
               `Source hash:     ${sourceHash}\n` +
               `Calculated hash: ${calculatedHash}`;
    }
}

class Block {
    static InvalidBlockError = InvalidBlockError;

    hash;
    version;
    prevHash;
    merkleRoot;
    time;
    bits;
    nonce;

    #rawBlock;
    #explorerName;
    #hashableBuffer;

    constructor (rawBlock, explorerName) {
        this.#rawBlock     = rawBlock;
        this.#explorerName = explorerName;

        const rawBlockFieldNameEquivalents = FIELD_NAME_EQUIVALENTS[explorerName] || {};

        for (const filedName in this) {
            const rawBlockFiledName = rawBlockFieldNameEquivalents[filedName] || filedName;

            this[filedName] = rawBlock[rawBlockFiledName];
        }

        this.#verify();
    }

    #verify () {
        const hash = this.#calculateHash();

        if (this.hash !== hash)
            throw new InvalidBlockError(this.hash, hash, this);
    }

    #toHashableBuffer () {
        const version    = Buffer.alloc(4);
        const prevHash   = Buffer.from(this.prevHash, 'hex');
        const merkleRoot = Buffer.from(this.merkleRoot, 'hex');
        const time       = Buffer.alloc(4);
        const bits       = Buffer.alloc(4);
        const nonce      = Buffer.alloc(4);
    
        version.writeUInt32LE(this.version);
        time.writeUInt32LE(this.time);
        bits.writeUInt32LE(this.bits);
        nonce.writeUInt32LE(this.nonce);
    
        prevHash.reverse();
        merkleRoot.reverse();
    
        return Buffer.concat([version, prevHash, merkleRoot, time, bits, nonce]);
    }

    #calculateHash () {
        const firstHash  = createHash('sha256');
        const secondHash = createHash('sha256');

        firstHash.update(this.hashableBuffer);
        secondHash.update(firstHash.digest());

        return secondHash.digest().reverse().toString('hex');
    }

    get rawBlock () {
        return this.#rawBlock;
    }

    get explorerName () {
        return this.#explorerName;
    }

    get hashableBuffer () {
        this.#hashableBuffer ??= this.#toHashableBuffer();

        return this.#hashableBuffer;
    }
}

module.exports = { Block };
