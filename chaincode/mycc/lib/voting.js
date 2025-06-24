'use strict';

const { Contract } = require('fabric-contract-api');

class VotingContract extends Contract {

    async InitLedger(ctx) {
        const elections = [
            {
                electionID: 'election1',
                type: 'general',
                name: '2025 General Election',
                faculty: 'all',
                status: 'open',
                candidates: ['Alice', 'Bob'],
                votes: {},
            },
            {
                electionID: 'election2',
                type: 'faculty',
                name: '2025 BCS Faculty Election',
                faculty: 'BCS',
                status: 'open',
                candidates: ['Tom', 'Jerry'],
                votes: {},
            },
        ];

        for (const election of elections) {
            await ctx.stub.putState(election.electionID, Buffer.from(JSON.stringify(election)));
        }
    }

    async CreateElection(ctx, electionID, type, name, faculty, candidatesJson) {
        const identity = ctx.clientIdentity.getID();
        const mspid = ctx.clientIdentity.getMSPID();

        if (mspid === 'Org1MSP' && faculty !== 'BCS' && faculty !== 'BFIT') {
            throw new Error('Org1 admin can only create elections for BCS or BFIT');
        }
        if (mspid === 'Org2MSP' && faculty !== 'LAW' && faculty !== 'BAED') {
            throw new Error('Org2 admin can only create elections for LAW or BAED');
        }

        const candidates = JSON.parse(candidatesJson);

        const election = {
            electionID,
            type,
            name,
            faculty,
            status: 'open',
            candidates,
            votes: {},
        };

        await ctx.stub.putState(electionID, Buffer.from(JSON.stringify(election)));
    }

    async Vote(ctx, electionID, candidate) {
        const identity = ctx.clientIdentity.getID();
        const electionBytes = await ctx.stub.getState(electionID);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionID} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());

        if (election.status !== 'open') {
            throw new Error('Election is not open');
        }

        if (election.votes[identity]) {
            throw new Error('This identity has already voted');
        }

        if (!election.candidates.includes(candidate)) {
            throw new Error('Invalid candidate');
        }

        election.votes[identity] = candidate;
        await ctx.stub.putState(electionID, Buffer.from(JSON.stringify(election)));
    }

    async CloseElection(ctx, electionID) {
        const electionBytes = await ctx.stub.getState(electionID);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionID} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());
        election.status = 'closed';

        await ctx.stub.putState(electionID, Buffer.from(JSON.stringify(election)));
    }

    async CountVotes(ctx, electionID) {
        const electionBytes = await ctx.stub.getState(electionID);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionID} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());
        const count = {};

        for (const candidate of election.candidates) {
            count[candidate] = 0;
        }

        for (const vote of Object.values(election.votes)) {
            count[vote]++;
        }

        return JSON.stringify(count);
    }

    async RegisterUser(ctx, userID) {
        const identity = ctx.clientIdentity.getID();
        const userKey = `user-${userID}`;

        const registrationLog = {
            userID,
            registeredBy: identity,
            timestamp: new Date().toISOString()
        };

        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(registrationLog)));
    }

    async GetUser(ctx, userID) {
        const userKey = `user-${userID}`;
        const userBytes = await ctx.stub.getState(userKey);
        if (!userBytes || userBytes.length === 0) {
            throw new Error(`User ${userID} not found`);
        }

        return userBytes.toString();
    }

    async ReadElection(ctx, electionID) {
        const electionBytes = await ctx.stub.getState(electionID);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionID} does not exist`);
        }
        return electionBytes.toString();
    }

    async GetAllElections(ctx) {
        const results = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        for await (const res of iterator) {
            const strValue = res.value.toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.electionID) {
                results.push(record);
            }
        }
        return JSON.stringify(results);
    }
}

module.exports = VotingContract;
