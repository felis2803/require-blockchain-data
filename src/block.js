const { createHash } = require('crypto');

class InvalidBlockError extends Error {
    constructor (sourceHash, calculatedHash, block) {
        const message = InvalidBlockError.formatError(sourceHash, calculatedHash);

        super(message);

        this.sourceHash     = sourceHash;
        this.calculatedHash = calculatedHash;
        this.block          = block;
        this.rawBlock       = block.rawBlock;
        this.explorer       = block.explorer;
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
    #explorer;
    #hashableBuffer;

    constructor (rawBlock, explorer) {
        this.#rawBlock = rawBlock;
        this.#explorer = explorer;

        const rawBlockFieldNameEquivalents = explorer.filedNameEquivalents || {};

        for (const filedName in this) {
            const rawBlockFiledName = rawBlockFieldNameEquivalents[filedName] || filedName;

            this[filedName] = rawBlock[rawBlockFiledName];
        }

        if (typeof this.time !== 'number')
            this.time = Date.parse(this.time) / 1000;

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

    get explorer () {
        return this.#explorer;
    }

    get hashableBuffer () {
        this.#hashableBuffer ??= this.#toHashableBuffer();

        return this.#hashableBuffer;
    }
}

module.exports = { Block };
