import React, { useState } from 'react';

class Politician {
  constructor(name, votes, money) {
    this.name = name;
    this.votes = votes;
    this.money = money;
  }
}

function Politicians() {
  const [politicians, setPoliticians] = useState([]);
  const [newPoliticianName, setNewPoliticianName] = useState('');
  const [newPoliticianVotes, setNewPoliticianVotes] = useState(0);
  const [newPoliticianMoney, setNewPoliticianMoney] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'newPoliticianName') {
      setNewPoliticianName(value);
    } else if (name === 'newPoliticianVotes') {
      setNewPoliticianVotes(parseInt(value));
    } else if (name === 'newPoliticianMoney') {
      setNewPoliticianMoney(parseInt(value));
    }
  };

  const handleAddPolitician = () => {
    const newPolitician = new Politician(
      newPoliticianName,
      newPoliticianVotes,
      newPoliticianMoney
    );

    if (editIndex >= 0) {
      const updatedPoliticians = [...politicians];
      updatedPoliticians[editIndex] = newPolitician;
      setPoliticians(updatedPoliticians);
      setNewPoliticianName('');
      setNewPoliticianVotes(0);
      setNewPoliticianMoney(0);
      setEditIndex(-1);
    } else {
      setPoliticians([...politicians, newPolitician]);
      setNewPoliticianName('');
      setNewPoliticianVotes(0);
      setNewPoliticianMoney(0);
    }
  };

  const handleEditPolitician = (index) => {
    const politician = politicians[index];
    setNewPoliticianName(politician.name);
    setNewPoliticianVotes(politician.votes);
    setNewPoliticianMoney(politician.money);
    setEditIndex(index);
  };

  const handleDeletePolitician = (index) => {
    setPoliticians(politicians.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Politician List</h2>
      <ul>
        {politicians.map((politician, index) => (
          <li key={index}>
            {politician.name} - Votes: {politician.votes}, Money: ${politician.money}
            <button onClick={() => handleEditPolitician(index)}>Edit</button>
            <button onClick={() => handleDeletePolitician(index)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>{editIndex >= 0 ? 'Update Politician' : 'Add New Politician'}</h2>
      <div>
        <label>Name: </label>
        <input
          type="text"
          name="newPoliticianName"
          value={newPoliticianName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Votes: </label>
        <input
          type="number"
          name="newPoliticianVotes"
          value={newPoliticianVotes}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Money: </label>
        <input
          type="number"
          name="newPoliticianMoney"
          value={newPoliticianMoney}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleAddPolitician}>
        {editIndex >= 0 ? 'Update Politician' : 'Add Politician'}
      </button>
    </div>
  );
}

export default Politicians;
