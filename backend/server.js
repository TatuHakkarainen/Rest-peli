const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pelitietokanta',
});

// Root endpoint
app.get('/', (req, res) => {
  return res.json('from backend side');
});

// Get all questions
app.get('/kysymykset', (req, res) => {
  const sql = 'SELECT * FROM kysymykset';
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get a specific question by ID
app.get('/kysymykset/:id', (req, res) => {
  const questionId = req.params.id;
  const sql = 'SELECT * FROM kysymykset WHERE id = ?';
  db.query(sql, [questionId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

// Add a new question
app.post('/addQuestion', (req, res) => {
  const { kysymys, vastaus } = req.body;
  const sql = 'INSERT INTO kysymykset (kysymys, vastaus) VALUES (?, ?)';
  db.query(sql, [kysymys, vastaus], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: 'Question added successfully', id: result.insertId });
  });
});

// Update a question by ID
app.put('/updateQuestion/:id', (req, res) => {
  const { kysymys, vastaus } = req.body;
  const questionId = req.params.id;
  const sql = 'UPDATE kysymykset SET kysymys = ?, vastaus = ? WHERE id = ?';
  db.query(sql, [kysymys, vastaus, questionId], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: 'Question updated successfully', affectedRows: result.affectedRows });
  });
});

// Delete a question by ID
app.delete('/deleteQuestion/:id', (req, res) => {
  const questionId = req.params.id;
  const sql = 'DELETE FROM kysymykset WHERE id = ?';
  db.query(sql, [questionId], (err, result) => {
    if (err) return res.json(err);
    return res.json({ message: 'Question deleted successfully', affectedRows: result.affectedRows });
  });
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log('listening');
});
