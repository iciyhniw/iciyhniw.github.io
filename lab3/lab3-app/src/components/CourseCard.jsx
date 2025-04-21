import { useState } from 'react';

function CourseCard({ course, isStarted, onStart }) {
  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <div className="course-card">
      <h4 className="course-title" onClick={() => setDetailsVisible(!detailsVisible)}>
        {course.course_title || 'Назва не вказана'}
      </h4>
      <div className="course-details" style={{ display: detailsVisible ? 'block' : 'none' }}>
        <p><strong>Організація:</strong> {course.course_organization || 'Н/Д'}</p>
        <p><strong>Рівень:</strong> {course.course_difficulty || 'Н/Д'}</p>
        <p><strong>Рейтинг:</strong> {course.course_rating || 'Н/Д'}</p>
        <p><strong>Студентів:</strong> {course.course_students_enrolled || 'Н/Д'}</p>
      </div>
      <div className="course-buttons">
        <button
          className="start-btn"
          disabled={isStarted}
          onClick={onStart}
        >
          {isStarted ? 'Розпочато' : 'Розпочати курс'}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
