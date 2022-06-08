const { expect } = require('chai');

const { getBlockByHash, getLastBlock } = require('#src');

const MILLISECONDS_IN_SECOND = 1000;
const MILLISECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * 60;

describe('getBlockByHash', () => {
    it('should return the valid block', async () => {
        const exampleBlock = require('./data/valid-block');
        const block        = await getBlockByHash(exampleBlock.hash);

        expect(exampleBlock).deep.eq(block);
    });
});

describe('getLastBlock', () => {
    it('should return a valid block', async () => {
        const block       = await getLastBlock();
        const blockTime   = block.time * MILLISECONDS_IN_SECOND;
        const currentTime = Date.now();
        
        expect(currentTime - blockTime).below(30 * MILLISECONDS_IN_MINUTE);
    })
});
