import React from 'react';
import { useParams } from 'react-router-dom';
import './ExamListPage.css';

const ExamListPage = () => {
  const { classId } = useParams();

  // Example exam data, which you can replace with a fetch from your backend later
  const exams = [
    {
      class: '1',
      title: 'Math Exam 1',
      link: 'https://forms.gle/example1', // Replace with actual Google Form links
    },
    {
      class: '1',
      title: 'Science Exam 1',
      link: 'https://forms.gle/example2',
    },
    {
      class: '2',
      title: 'Math Exam 2',
      link: 'https://forms.gle/example3',
    },
    {
      class: '2',
      title: 'Science Exam 2',
      link: 'https://forms.gle/example4',
    },
    // Add more exams as needed
  ];

  // Filter exams based on the classId
  const filteredExams = exams.filter(exam => exam.class === classId);

  return (
    <div className="exam-list-page">
      <h1>Exams for Class {classId}</h1>
      <div className="exam-container">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam, index) => (
            <div className="exam-box" key={index}>
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
