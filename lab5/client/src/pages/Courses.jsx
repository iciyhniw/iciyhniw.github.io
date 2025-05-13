import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard.jsx';

function Courses({ isLoggedIn }) {
  const [courses, setCourses] = useState([]);
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);
  const [sortOrder, setSortOrder] = useState('none');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Не вдалося завантажити курси');
        }
        const coursesData = await response.json();
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Помилка завантаження курсів:', error);
        setError('Не вдалося завантажити курси. Спробуйте пізніше.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStartCourse = (courseTitle) => {
    const updatedStartedCourses = [...startedCourses, courseTitle];
    setStartedCourses(updatedStartedCourses);
    localStorage.setItem('startedCourses', JSON.stringify(updatedStartedCourses));
  };

  const getFilteredAndSortedCourses = () => {
    let filteredCourses = [...courses];

    // Фільтрація за складністю
    if (selectedDifficulty !== 'all') {
      filteredCourses = filteredCourses.filter(course =>
          course.course_difficulty === selectedDifficulty
      );
    }

    // Сортування за тривалістю
    if (sortOrder === 'asc') {
      filteredCourses.sort((a, b) => (a.duration_weeks || 0) - (b.duration_weeks || 0));
    } else if (sortOrder === 'desc') {
      filteredCourses.sort((a, b) => (b.duration_weeks || 0) - (a.duration_weeks || 0));
    }

    return filteredCourses;
  };

  const toggleSort = () => {
    setSortOrder(prev => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
  };

  return (
      <main>
        <section className="courses">
          <div className="courses-content">
            <h3>Доступні курси</h3>
            {!isLoggedIn && (
                <p className="restricted-message">
                  Увійдіть, щоб переглянути деталі курсів та залишити відгуки.
                </p>
            )}
            {loading && <p className="loading-message">Завантаження курсів...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="courses-controls">
              <button
                  className="sort-btn"
                  onClick={toggleSort}
              >
                {sortOrder === 'none' ? 'Сортувати за тривалістю' :
                    sortOrder === 'asc' ? 'Сортувати (зростання)' : 'Сортувати (спадання)'}
              </button>
              <select
                  className="difficulty-filter"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">Усі рівні складності</option>
                <option value="Beginner">Початковий</option>
                <option value="Intermediate">Середній</option>
                <option value="Mixed">Змішаний</option>
              </select>
            </div>
            <div className="courses-grid">
              {getFilteredAndSortedCourses().length === 0 && !loading && !error ? (
                  <p>Курси не знайдено.</p>
              ) : (
                  getFilteredAndSortedCourses().map((course) => (
                      <CourseCard
                          key={course.id}
                          course={course}
                          isStarted={startedCourses.includes(course.course_title)}
                          onStart={() => handleStartCourse(course.course_title)}
                          isLoggedIn={isLoggedIn}
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