import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamPage.css';

const ExamPage = () => {
  const navigate = useNavigate();
  const classes = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]

  return (
    <div className="exam-page">
      <h1>Select Your Class</h1>
      <div className="class-container">
        {classes.map((classNumber) => (
          <div
            key={classNumber}
            className="class-box"
            onClick={() => navigate(`/exampage/${classNumber}`)}
          >
            <h3>Class {classNumber}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamPage;
