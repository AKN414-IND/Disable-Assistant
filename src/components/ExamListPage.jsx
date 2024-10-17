import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../Firebase';
import { ref, onValue } from 'firebase/database';
import './ExamListPage.css';

const ExamListPage = () => {
  const { classId } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const examsRef = ref(database, 'exams');

    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val();
      const examsArray = [];

      if (examsData) {
        // Transforming the Firebase data into an array
        for (let id in examsData) {
          examsArray.push({ id, ...examsData[id] });
        }
      }

      console.log("Fetched exams:", examsArray); // Log the fetched exams
      setExams(examsArray);
      setLoading(false); // Set loading to false
    });
  }, []);

  const filteredExams = exams.filter((exam) => exam.class === `Class ${classId}`);

  return (
    <div className="exam-list-page">
      <h1>Exams for Class {classId}</h1>
      <div className="exam-container">
        {loading ? ( // Show loading state
          <p>Loading exams...</p>
        ) : filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <div className="exam-box" key={exam.id}>
              <h3>{exam.title}</h3>
              <a href={exam.link} target="_blank" rel="noopener noreferrer">
                Go to Exam
              </a>
            </div>
          ))
        ) : (
          <p>No exams available for this class.</p>
        )}
      </div>
    </div>
  );
};

export default ExamListPage;
