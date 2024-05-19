const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/archery', { useNewUrlParser: true, useUnifiedTopology: true });

const roundSchema = new mongoose.Schema({ name: String, distance: Number, faceSize: Number });
const scoreSchema = new mongoose.Schema({
  userId: String,
  roundId: String,
  scores: Array,
  total: Number,
  date: Date
});

const Round = mongoose.model('Round', roundSchema);
const Score = mongoose.model('Score', scoreSchema);

app.get('/api/rounds', async (req, res) => {
  const rounds = await Round.find();
  res.send(rounds);
});

app.post('/api/scores', async (req, res) => {
  const score = new Score(req.body);
  await score.save();
  res.send(score);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
