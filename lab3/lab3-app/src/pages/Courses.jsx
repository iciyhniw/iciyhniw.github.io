import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard.jsx';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);

  useEffect(() => {
    fetch('/csvjson.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setCourses(data);
      })
      .catch(error => {
        console.error('Error loading courses:', error);
        setCourses([]);
      });
  }, []);

  const handleStartCourse = (courseTitle) => {
    const updatedStartedCourses = [...startedCourses, courseTitle];
    setStartedCourses(updatedStartedCourses);
    localStorage.setItem('startedCourses', JSON.stringify(updatedStartedCourses));
  };

  return (
    <main>
      <section className="courses">
        <div className="courses-content">
          <h3>Доступні курси</h3>
          <div className="courses-grid">
            {courses.length === 0 ? (
              <p>Курси не знайдено.</p>
            ) : (
              courses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  isStarted={startedCourses.includes(course.course_title)}
                  onStart={() => handleStartCourse(course.course_title)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Courses;
