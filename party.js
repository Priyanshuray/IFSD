const prompt = require('prompt-sync')();
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
  
  function main() {
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
  
    // Find the politician with the maximum votes and money for each party
    for (const party of parties) {
      const maxVotesPolitician = party.getMaxVotesPolitician();
      const maxMoneyPolitician = party.getMaxMoneyPolitician();
  
      console.log(`Party: ${party.name}`);
      console.log(`Politician with the maximum votes: ${maxVotesPolitician ? maxVotesPolitician.name : 'No politicians'}`);
      console.log(`Politician with the maximum money: ${maxMoneyPolitician ? maxMoneyPolitician.name : 'No politicians'}`);
      console.log('-----------------------');
    }
  }
  
  main();
  