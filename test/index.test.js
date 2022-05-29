const { expect } = require('chai');

const { getBlockByHash } = require('#src');

describe('getBlockByHash', () => {
    it('should return the valid block', async function () {
        this.timeout(10000);

        const exampleBlock = require('./data/valid-block');
        const block        = await getBlockByHash(exampleBlock.hash);

        expect(exampleBlock).deep.eq(block);
    });
});