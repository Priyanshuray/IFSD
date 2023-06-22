const express = require('express');
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

// Define Politician schema
const politicianSchema = new mongoose.Schema({
  name: String,
  votes: Number,
  money: Number
});

// Define Party schema
const partySchema = new mongoose.Schema({
  name: String,
  politicians: [politicianSchema]
});

// Create Party model
const PartyModel = mongoose.model('Party', partySchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://priyanshubsc22:cricketstar%23@cluster0.f88qomj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    startServer(); // Start the Express server after successful MongoDB connection
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create Express server
function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint to add a party
  app.post('/parties', async (req, res) => {
    const { name, politicians } = req.body;

    try {
      const party = new PartyModel({ name, politicians });
      await party.save();
      res.status(201).json({ message: 'Party added successfully' });
    } catch (error) {
      console.error('Error adding party:', error);
      res.status(500).json({ message: 'Failed to add party' });
    }
  });

  // API endpoint to get the politicians with the maximum votes and money for each party
  app.get('/parties', async (req, res) => {
    try {
      const parties = await PartyModel.find();
      const result = parties.map(party => {
        const maxVotesPolitician = getMaxVotesPolitician(party);
        const maxMoneyPolitician = getMaxMoneyPolitician(party);
        return {
          partyName: party.name,
          maxVotesPolitician: maxVotesPolitician ? maxVotesPolitician.name : 'No politicians',
          maxMoneyPolitician: maxMoneyPolitician ? maxMoneyPolitician.name : 'No politicians'
        };
      });
      res.json(result);
    } catch (error) {
      console.error('Error getting parties:', error);
      res.status(500).json({ message: 'Failed to get parties' });
    }
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

function getMaxVotesPolitician(party) {
  let maxVotes = 0;
  let maxVotesPolitician = null;

  for (const politician of party.politicians) {
    if (politician.votes > maxVotes) {
      maxVotes = politician.votes;
      maxVotesPolitician = politician;
    }
  }

  return maxVotesPolitician;
}

function getMaxMoneyPolitician(party) {
  let maxMoney = 0;
  let maxMoneyPolitician = null;

  for (const politician of party.politicians) {
    if (politician.money > maxMoney) {
      maxMoney = politician.money;
      maxMoneyPolitician = politician;
    }
  }

  return maxMoneyPolitician;
}

async function main() {
  const numParties = parseInt(prompt('Enter the number of parties: '));

  const parties = [];

  for (let i = 1; i <= numParties; i++) {
    const partyName = prompt(`Enter the name of party ${i}: `);
    const politicians = [];

    const numPoliticians = parseInt(prompt(`Enter the number of politicians for party ${i}: `));

    for (let j = 1; j <= numPoliticians; j++) {
      const politicianName = prompt(`Enter the name of politician ${j} for party ${i}: `);
      const votes = parseInt(prompt(`Enter the number of votes for politician ${j} of party ${i}: `));
      const money = parseInt(prompt(`Enter the amount of money for politician ${j} of party ${i}: `));

      politicians.push({ name: politicianName, votes, money });
    }

    const party = { name: partyName, politicians };
    parties.push(party);

    // Save the party and its politicians to MongoDB
    const partyData = new PartyModel(party);
    await partyData.save();
  }

  // Fetch the parties with the politicians who have the maximum votes and money
  const partiesFromDB = await PartyModel.find();
  for (const party of partiesFromDB) {
    const maxVotesPolitician = getMaxVotesPolitician(party);
    const maxMoneyPolitician = getMaxMoneyPolitician(party);

    console.log(`Party: ${party.name}`);
    console.log(`Politician with the maximum votes: ${maxVotesPolitician ? maxVotesPolitician.name : 'No politicians'}`);
    console.log(`Politician with the maximum money: ${maxMoneyPolitician ? maxMoneyPolitician.name : 'No politicians'}`);
    console.log('-----------------------');
  }
}

main();
