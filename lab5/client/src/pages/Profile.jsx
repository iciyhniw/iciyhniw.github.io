import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import CourseCard from '../components/CourseCard.jsx';

function Profile() {
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);
  const [completedCourses, setCompletedCourses] = useState(JSON.parse(localStorage.getItem('completedCourses')) || []);
  const [userName, setUserName] = useState('');
  const [savedUserName, setSavedUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const token = await user.getIdToken();
      const response = await fetch('https://iciyhniw-github-io.onrender.com/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося отримати дані профілю');
      }
      setSavedUserName(data.name || '');
      setUserEmail(data.email || '');
      setUserName(data.name || '');
    } catch (error) {
      setError('Помилка при отриманні даних: ' + error.message);
    }
  };

  const fetchStartedCourses = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const token = await user.getIdToken();
      const response = await fetch('https://iciyhniw-github-io.onrender.com/api/started-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося отримати розпочаті курси');
      }
      setStartedCourses(data);
      localStorage.setItem('startedCourses', JSON.stringify(data));
    } catch (error) {
      setError('Помилка при отриманні курсів: ' + error.message);
    }
  };

  const saveUserData = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const token = await user.getIdToken();
      const response = await fetch('https://iciyhniw-github-io.onrender.com/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          updatedAt: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося зберегти дані');
      }
      alert('Дані успішно збережено!');
      fetchUserData();
    } catch (error) {
      setError('Помилка при збереженні даних: ' + error.message);
    }
  };

  const handleCompleteCourse = async (course) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const token = await user.getIdToken();
      const response = await fetch('https://iciyhniw-github-io.onrender.com/api/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ courseTitle: course }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося завершити курс');
      }
      const updatedCompletedCourses = [...completedCourses, course];
      setCompletedCourses(updatedCompletedCourses);
      localStorage.setItem('completedCourses', JSON.stringify(updatedCompletedCourses));
    } catch (error) {
      setError('Помилка при завершенні курсу: ' + error.message);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const token = await user.getIdToken();
      const response = await fetch('https://iciyhniw-github-io.onrender.com/api/completed-courses', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося очистити завершені курси');
      }
      setCompletedCourses([]);
      localStorage.setItem('completedCourses', JSON.stringify([]));
    } catch (error) {
      setError('Помилка при очищенні курсів: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchStartedCourses();
  }, []);

  const progress = startedCourses.length === 0 ? 0 : Math.round((completedCourses.length / startedCourses.length) * 100);

  return (
      <main>
        <section className="profile">
          <div className="profile-content">
            <h3>Мій кабінет</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="profile-section">
              <h4>Інформація про користувача</h4>
              <form onSubmit={saveUserData}>
                <label htmlFor="userName">Ім'я:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Введіть ваше ім'я"
                    required
                />
                <label htmlFor="userEmail">Електронна пошта:</label>
                <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Введіть ваш email"
                    required
                />
                <button type="submit">Зберегти дані</button>
              </form>
              <div className="user-info">
                <h5>Збережені дані:</h5>
                <p><strong>Ім'я:</strong> {savedUserName || 'Не вказано'}</p>
                <p><strong>Email:</strong> {userEmail || 'Не вказано'}</p>
              </div>
            </div>
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