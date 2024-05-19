import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScoreEntry = () => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [scores, setScores] = useState([]);
  const [currentEnd, setCurrentEnd] = useState(1);
  const [score, setScore] = useState('');

  useEffect(() => {
    axios.get('/api/rounds')
      .then(response => {
        setRounds(response.data);
      })
      .catch(error => {
        console.error('Error fetching rounds:', error);
      });
  }, []);

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const handleSubmitScore = () => {
    if (score !== '') {
      setScores([...scores, { end: currentEnd, score: parseInt(score) }]);
      setScore('');
      setCurrentEnd(currentEnd + 1);
    }
  };

  const handleFinish = () => {
    axios.post('/api/scores', {
      roundId: selectedRound,
      scores,
      total: scores.reduce((acc, curr) => acc + curr.score, 0),
      date: new Date()
    })
    .then(() => {
      alert('Scores submitted successfully');
      setScores([]);
      setCurrentEnd(1);
    })
    .catch(error => {
      console.error('Error submitting scores:', error);
    });
  };

  return (
    <div>
      <h1>Enter Archery Scores</h1>
      <div>
        <label>Select Round:</label>
        <select onChange={(e) => setSelectedRound(e.target.value)} defaultValue="">
          <option value="" disabled>Select a round</option>
          {rounds.map(round => (
            <option key={round._id} value={round._id}>{round.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h2>End {currentEnd}</h2>
        <input type="number" value={score} onChange={handleScoreChange} placeholder="Enter score" />
        <button onClick={handleSubmitScore}>Submit Score</button>
      </div>
      {currentEnd > 5 && <button onClick={handleFinish}>Finish</button>}
    </div>
  );
};

export default ScoreEntry;
