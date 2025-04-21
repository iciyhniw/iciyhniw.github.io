import { useState } from 'react';

function Profile() {
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);
  const [completedCourses, setCompletedCourses] = useState(JSON.parse(localStorage.getItem('completedCourses')) || []);

  const handleCompleteCourse = (course) => {
    const updatedCompletedCourses = [...completedCourses, course];
    setCompletedCourses(updatedCompletedCourses);
    localStorage.setItem('completedCourses', JSON.stringify(updatedCompletedCourses));
  };

  const handleClearCompleted = () => {
    setCompletedCourses([]);
    localStorage.setItem('completedCourses', JSON.stringify([]));
  };

  const progress = startedCourses.length === 0 ? 0 : Math.round((completedCourses.length / startedCourses.length) * 100);

  return (
    <main>
      <section className="profile">
        <div className="profile-content">
          <h3>Мій кабінет</h3>
          <div className="profile-section">
            <h4>Прогрес навчання</h4>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{`Прогрес: ${progress}% (${completedCourses.length} з ${startedCourses.length} завершено)`}</p>
          </div>
          <div className="profile-section">
            <div className="courses-header">
              <h4>Розпочаті курси</h4>
              <button className="clear-btn" onClick={handleClearCompleted}>×</button>
            </div>
            <ul>
              {startedCourses.map((course, index) => (
                <li key={index}>
                  {course}
                  <button
                    className="complete-btn"
                    disabled={completedCourses.includes(course)}
                    onClick={() => handleCompleteCourse(course)}
                  >
                    {completedCourses.includes(course) ? 'Завершено' : 'Завершити курс'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
