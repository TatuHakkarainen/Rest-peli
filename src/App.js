import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  // State variables
  const [data, setData] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch questions from the backend
  const fetchData = () => {
    fetch('http://localhost:3001/kysymykset')
      .then((res) => res.json())
      .then((data) =>
        setData(
          data.map((question) => ({
            ...question,
            userAnswer: '',
            isCorrect: null,
          }))
        )
      )
      .catch((err) => console.log(err));
  };

  // Function to add a new question
  const handleAddQuestion = () => {
    fetch('http://localhost:3001/addQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kysymys: newQuestion, vastaus: newAnswer }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setNewQuestion('');
        setNewAnswer('');
      })
      .catch((error) => console.error('Error:', error));
  };

  // Function to update a question
  const handleUpdateQuestion = (id, updatedQuestion, updatedAnswer) => {
    fetch(`http://localhost:3001/updateQuestion/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kysymys: updatedQuestion, vastaus: updatedAnswer }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
      })
      .catch((error) => console.error('Error:', error));
  };

  // Function to delete a question
  const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:3001/deleteQuestion/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
      })
      .catch((error) => console.error('Error:', error));
  };

  // Function to check the user's answer against the correct answer
  const handleCheckAnswer = (id, correctAnswer, userAnswer) => {
    const updatedData = data.map((question) => {
      if (question.id === id) {
        const isCorrect = correctAnswer.toLowerCase() === userAnswer.toLowerCase();
        return { ...question, userAnswer, isCorrect };
      }
      return question;
    });
    setData(updatedData);
  };

  // Function to fetch a question by ID
  const handleFetchQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/kysymykset/${id}`);
      const question = await response.json();
      setSelectedQuestion(question);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      {/* Table displaying questions */}
      <table>
        <thead>
          <tr>
            <th>Numero</th>
            <th>Kysymys</th>
            <th>Käyttäjän vastaus</th>
            <th>Tarkista vastaus</th>
            <th>Oikein/Väärin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.kysymys}</td>
              <td>
                {/* Input for user's answer */}
                <input
                  type="text"
                  value={d.userAnswer}
                  onChange={(e) => {
                    const updatedData = data.map((question) => {
                      if (question.id === d.id) {
                        return { ...question, userAnswer: e.target.value };
                      }
                      return question;
                    });
                    setData(updatedData);
                  }}
                />
              </td>
              <td>
                {/* Button to check the user's answer */}
                <button onClick={() => handleCheckAnswer(d.id, d.vastaus, d.userAnswer)}>Tarkista</button>
              </td>
              <td>{d.isCorrect === true ? 'Oikein' : d.isCorrect === false ? 'Väärin' : ''}</td>
              <td>
                {/* Buttons to update and delete a question */}
                <button
                  onClick={() =>
                    handleUpdateQuestion(
                      d.id,
                      prompt('Enter updated question'),
                      prompt('Enter updated answer')
                    )
                  }
                >
                  Update
                </button>
                <button onClick={() => handleDeleteQuestion(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section to add a new question */}
      <div>
        <h2>Lisää uusi kysymys</h2>
        <label>
          Kysymys:
          <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
        </label>
        <label>
          Vastaus:
          <input type="text" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
        </label>
        <button onClick={handleAddQuestion}>Lisää kysymys</button>
      </div>

      {/* Section to fetch a question by ID */}
      <div>
        <h2>Hae kysymys ID:n perusteella</h2>
        <label>
          Kysymyksen ID:
          <input
            type="text"
            value={selectedQuestionId}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
          />
        </label>
        <button onClick={() => handleFetchQuestion(selectedQuestionId)}>Hae kysymys</button>
        {selectedQuestion && (
          <div>
            <h3>{selectedQuestion.kysymys}</h3>
            <p>Vastaus: {selectedQuestion.vastaus}</p>
          </div>
        )}
      </div>
    </div>
  );
}
