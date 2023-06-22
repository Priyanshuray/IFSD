const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

class Politician {
  constructor(name, votes, money) {
    this.name = name;
    this.votes = votes;
    this.money = money;
  }
}

class Party {
  constructor(name) {
    this.name = name;
    this.politicians = [];
  }

  addPolitician(name, votes, money) {
    const politician = new Politician(name, votes, money);
    this.politicians.push(politician);
  }

  getMaxVotesPolitician() {
    let maxVotes = 0;
    let maxVotesPolitician = null;

    for (const politician of this.politicians) {
      if (politician.votes > maxVotes) {
        maxVotes = politician.votes;
        maxVotesPolitician = politician;
      }
    }

    return maxVotesPolitician;
  }

  getMaxMoneyPolitician() {
    let maxMoney = 0;
    let maxMoneyPolitician = null;

    for (const politician of this.politicians) {
      if (politician.money > maxMoney) {
        maxMoney = politician.money;
        maxMoneyPolitician = politician;
      }
    }

    return maxMoneyPolitician;
  }
}

async function main() {
  const url = 'mongodb+srv://priyanshubsc22:cricketstar%23@cluster0.f88qomj.mongodb.net/mydatabase?retryWrites=true&w=majority'; // Replace with your MongoDB connection URL
  const dbName = 'Party'; // Replace with your database name
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to the database.');

    const db = client.db(dbName);
    const partiesCollection = db.collection('parties');

    // Create and insert parties and politicians into the database
    const numParties = parseInt(prompt('Enter the number of parties:'));
    const parties = [];

    for (let i = 1; i <= numParties; i++) {
      const partyName = prompt(`Enter the name of party ${i}:`);
      const party = new Party(partyName);

      const numPoliticians = parseInt(prompt(`Enter the number of politicians for party ${i}:`));

      for (let j = 1; j <= numPoliticians; j++) {
        const politicianName = prompt(`Enter the name of politician ${j} for party ${i}:`);
        const votes = parseInt(prompt(`Enter the number of votes for politician ${j} of party ${i}:`));
        const money = parseInt(prompt(`Enter the amount of money for politician ${j} of party ${i}:`));

        party.addPolitician(politicianName, votes, money);
      }

      parties.push(party);
    }

    // Insert parties and politicians into the database
    for (const party of parties) {
      await partiesCollection.insertOne(party);
    }

    console.log('Data has been inserted into the database.');

    // ... (previous code)

// Retrieve parties from the database
const retrievedParties = await partiesCollection.find().toArray();

// Find the politician with the maximum votes and money for each party
for (const partyData of retrievedParties) {
  const party = new Party(partyData.name);
  party.politicians = partyData.politicians.map(
    (politicianData) => new Politician(politicianData.name, politicianData.votes, politicianData.money)
  );

  const maxVotesPolitician = party.getMaxVotesPolitician();
  const maxMoneyPolitician = party.getMaxMoneyPolitician();

  console.log(`Party: ${party.name}`);
  console.log(`Politician with the maximum votes: ${maxVotesPolitician ? maxVotesPolitician.name : 'No politicians'}`);
  console.log(`Politician with the maximum money: ${maxMoneyPolitician ? maxMoneyPolitician.name : 'No politicians'}`);
  console.log('-----------------------');
}

// ... (remaining code)


    // Perform CRUD operations
    const operation = prompt('Select CRUD operation [create/read/update/delete]: ');

    if (operation === 'create') {
      // Create a new party and insert into the database
      const partyName = prompt('Enter the name of the party to create: ');
      const party = new Party(partyName);

      const numPoliticians = parseInt(prompt('Enter the number of politicians for the party: '));

      for (let i = 1; i <= numPoliticians; i++) {
        const politicianName = prompt(`Enter the name of politician ${i} for the party: `);
        const votes = parseInt(prompt(`Enter the number of votes for politician ${i} of the party: `));
        const money = parseInt(prompt(`Enter the amount of money for politician ${i} of the party: `));

        party.addPolitician(politicianName, votes, money);
      }

      await partiesCollection.insertOne(party);
      console.log('New party has been created.');
    } else if (operation === 'read') {
      // Retrieve all parties and their politicians from the database
      const allParties = await partiesCollection.find().toArray();
      console.log(allParties);
    } else if (operation === 'update') {
      // Update a specific politician's votes and money
      const partyId = prompt('Enter the party ID: ');
      const politicianId = prompt('Enter the politician ID: ');

      const votes = parseInt(prompt('Enter the new number of votes: '));
      const money = parseInt(prompt('Enter the new amount of money: '));

      await partiesCollection.updateOne(
        { _id: ObjectId(partyId), 'politicians._id': ObjectId(politicianId) },
        { $set: { 'politicians.$.votes': votes, 'politicians.$.money': money } }
      );
      console.log('Politician has been updated.');
    } else if (operation === 'delete') {
      // Delete a specific politician
      const partyId = prompt('Enter the party ID: ');
      const politicianId = prompt('Enter the politician ID: ');

      await partiesCollection.updateOne(
        { _id: ObjectId(partyId) },
        { $pull: { politicians: { _id: ObjectId(politicianId) } } }
      );
      console.log('Politician has been deleted.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
    console.log('Disconnected from the database.');
  }
}

main();
