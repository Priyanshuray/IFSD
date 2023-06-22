import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Politician {
  constructor(name, votes, money) {
    this.name = name;
    this.votes = votes;
    this.money = money;
  }
}

class PoliticianCRUD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      politicians: [],
      newPoliticianName: '',
      newPoliticianVotes: 0,
      newPoliticianMoney: 0,
      editIndex: -1,
    };
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAddPolitician() {
    const { politicians, newPoliticianName, newPoliticianVotes, newPoliticianMoney, editIndex } = this.state;
    const newPolitician = new Politician(
      newPoliticianName,
      parseInt(newPoliticianVotes),
      parseInt(newPoliticianMoney)
    );

    if (editIndex >= 0) {
      const updatedPoliticians = [...politicians];
      updatedPoliticians[editIndex] = newPolitician;
      this.setState({
        politicians: updatedPoliticians,
        newPoliticianName: '',
        newPoliticianVotes: 0,
        newPoliticianMoney: 0,
        editIndex: -1,
      });
    } else {
      this.setState(prevState => ({
        politicians: [...prevState.politicians, newPolitician],
        newPoliticianName: '',
        newPoliticianVotes: 0,
        newPoliticianMoney: 0,
      }));
    }
  }

  handleEditPolitician(index) {
    const { politicians } = this.state;
    const politician = politicians[index];
    this.setState({
      newPoliticianName: politician.name,
      newPoliticianVotes: politician.votes,
      newPoliticianMoney: politician.money,
      editIndex: index,
    });
  }

  handleDeletePolitician(index) {
    this.setState(prevState => ({
      politicians: prevState.politicians.filter((_, i) => i !== index)
    }));
  }

  render() {
    const { politicians, newPoliticianName, newPoliticianVotes, newPoliticianMoney, editIndex } = this.state;

    return (
      <div>
        <h2>Politician List</h2>
        <ul>
          {politicians.map((politician, index) => (
            <li key={index}>
              {politician.name} - Votes: {politician.votes}, Money: ${politician.money}
              <button onClick={() => this.handleEditPolitician(index)}>Edit</button>
              <button onClick={() => this.handleDeletePolitician(index)}>Delete</button>
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
            onChange={event => this.handleInputChange(event)}
          />
        </div>
        <div>
          <label>Votes: </label>
          <input
            type="number"
            name="newPoliticianVotes"
            value={newPoliticianVotes}
            onChange={event => this.handleInputChange(event)}
          />
        </div>
        <div>
          <label>Money: </label>
          <input
            type="number"
            name="newPoliticianMoney"
            value={newPoliticianMoney}
            onChange={event => this.handleInputChange(event)}
          />
        </div>
        <button onClick={() => this.handleAddPolitician()}>
          {editIndex >= 0 ? 'Update Politician' : 'Add Politician'}
        </button>
      </div>
    );
  }
}

function PoliticianScene() {
  return (
    <div>
      <h1>Politician Scene</h1>
      <PoliticianCRUD />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/politician">Politician Scene</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/politician">
            <PoliticianScene />
          </Route>
          <Route path="/">
            {/* Render your home scene/component here */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
