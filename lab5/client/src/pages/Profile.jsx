import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import firebase from '../FirebaseConf';

const { auth } = firebase;

function Profile() {
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);
  const [completedCourses, setCompletedCourses] = useState(JSON.parse(localStorage.getItem('completedCourses')) || []);
  const [userName, setUserName] = useState('');
  const [savedUserName, setSavedUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const saveUserData = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const idToken = await user.getIdToken();
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name: userName, email: userEmail }),
      });
      if (!response.ok) {
        throw new Error('Помилка при збереженні даних');
      }
      toast.success('Дані успішно збережено!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      fetchUserData();
    } catch (error) {
      toast.error('Помилка при збереженні даних: ' + error.message, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Користувач не автентифікований');
      }
      const idToken = await user.getIdToken();
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Помилка при отриманні даних');
      }
      const data = await response.json();
      setSavedUserName(data.name || '');
      setUserEmail(data.email || '');
    } catch (error) {
      toast.error('Помилка при отриманні даних: ' + error.message, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCompleteCourse = (course) => {
    const updatedCompletedCourses = [...completedCourses, course];
    setCompletedCourses(updatedCompletedCourses);
    localStorage.setItem('completedCourses', JSON.stringify(updatedCompletedCourses));
    toast.success(`Курс "${course}" позначено завершеним!`, {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'light',
    });
  };

  const handleClearCompleted = () => {
    setCompletedCourses([]);
    localStorage.setItem('completedCourses', JSON.stringify([]));
    toast.info('Список завершених курсів очищено.', {
      position: 'bottom-right',
      autoClose: 3000,
      theme: 'light',
    });
  };

  const progress = startedCourses.length === 0 ? 0 : Math.round((completedCourses.length / startedCourses.length) * 100);

  return (
      <main>
        <section className="profile">
          <div className="profile-content">
            <h3>Мій кабінет</h3>
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
