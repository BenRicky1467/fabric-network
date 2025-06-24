'use strict';

const { Contract } = require('fabric-contract-api');

class MyContract extends Contract {

  async initLedger(ctx) {
    console.info('Ledger initialized');
  }

  async vote(ctx, voterId, candidate) {
    const voteRecord = {
      voter: voterId,
      candidate: candidate,
      timestamp: new Date().toISOString(),
    };
    await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(voteRecord)));
    console.info(`Vote recorded: ${JSON.stringify(voteRecord)}`);
    return JSON.stringify(voteRecord);
  }

  async queryVote(ctx, voterId) {
    const voteJSON = await ctx.stub.getState(voterId);
    if (!voteJSON || voteJSON.length === 0) {
      throw new Error(`No vote found for voter: ${voterId}`);
    }
    return voteJSON.toString();
  }

}

module.exports = MyContract;
