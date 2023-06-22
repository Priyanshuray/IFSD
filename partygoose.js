const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

const politicianSchema = new mongoose.Schema({
  name: String,
  votes: Number,
  money: Number
});

const partySchema = new mongoose.Schema({
  name: String,
  politicians: [politicianSchema]
});

const Politician = mongoose.model('Politician', politicianSchema);
const Party = mongoose.model('Party', partySchema);

async function main() {
  const url = 'mongodb+srv://priyanshubsc22:cricketstar%23@cluster0.f88qomj.mongodb.net/mydatabase?retryWrites=true&w=majority'; // Replace with your MongoDB connection URL
  const dbName = 'Party'; // Replace with your database name

  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to the database.');

  try {
    // Create and insert parties and politicians into the database
    const numParties = parseInt(prompt('Enter the number of parties:'));
    const parties = [];

    for (let i = 1; i <= numParties; i++) {
      const partyName = prompt(`Enter the name of party ${i}:`);
      const party = new Party({ name: partyName });

      const numPoliticians = parseInt(prompt(`Enter the number of politicians for party ${i}:`));

      for (let j = 1; j <= numPoliticians; j++) {
        const politicianName = prompt(`Enter the name of politician ${j} for party ${i}:`);
        const votes = parseInt(prompt(`Enter the number of votes for politician ${j} of party ${i}:`));
        const money = parseInt(prompt(`Enter the amount of money for politician ${j} of party ${i}:`));

        party.politicians.push({ name: politicianName, votes, money });
      }

      await party.save();
      parties.push(party);
    }

    console.log('Data has been inserted into the database.');

    // Retrieve parties from the database
    const retrievedParties = await Party.find();

    // Find the politician with the maximum votes and money for each party
    for (const party of retrievedParties) {
      const maxVotesPolitician = party.getMaxVotesPolitician();
      const maxMoneyPolitician = party.getMaxMoneyPolitician();

      console.log(`Party: ${party.name}`);
      console.log(`Politician with the maximum votes: ${maxVotesPolitician ? maxVotesPolitician.name : 'No politicians'}`);
      console.log(`Politician with the maximum money: ${maxMoneyPolitician ? maxMoneyPolitician.name : 'No politicians'}`);
      console.log('-----------------------');
    }

    // Perform CRUD operations
    const operation = prompt('Select CRUD operation [create/read/update/delete]: ');

    if (operation === 'create') {
      // Create a new party and insert into the database
      const partyName = prompt('Enter the name of the party to create: ');
      const party = new Party({ name: partyName });

      const numPoliticians = parseInt(prompt('Enter the number of politicians for the party: '));

      for (let i = 1; i <= numPoliticians; i++) {
        const politicianName = prompt(`Enter the name of politician ${i} for the party: `);
        const votes = parseInt(prompt(`Enter the number of votes for politician ${i} of the party: `));
        const money = parseInt(prompt(`Enter the amount of money for politician ${i} of the party: `));

        party.politicians.push({ name: politicianName, votes, money });
      }

      await party.save();
      console.log('New party has been created.');
    } else if (operation === 'read') {
      // Retrieve all parties and their politicians from the database
      const allParties = await Party.find();
      console.log(allParties);
    } else if (operation === 'update') {
      // Update a specific politician's votes and money
      const partyId = prompt('Enter the party ID: ');
      const politicianId = prompt('Enter the politician ID: ');

      const votes = parseInt(prompt('Enter the new number of votes: '));
      const money = parseInt(prompt('Enter the new amount of money: '));

      await Party.updateOne(
        { _id: partyId, 'politicians._id': politicianId },
        { $set: { 'politicians.$.votes': votes, 'politicians.$.money': money } }
      );
      console.log('Politician has been updated.');
    } else if (operation === 'delete') {
      // Delete a specific politician
      const partyId = prompt('Enter the party ID: ');
      const politicianId = prompt('Enter the politician ID: ');

      await Party.updateOne(
        { _id: partyId },
        { $pull: { politicians: { _id: politicianId } } }
      );
      console.log('Politician has been deleted.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('Disconnected from the database.');
  }
}

main();
