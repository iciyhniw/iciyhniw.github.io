import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import firebase from '../FirebaseConf';

const { db } = firebase;
function Profile() {
  const [startedCourses, setStartedCourses] = useState(JSON.parse(localStorage.getItem('startedCourses')) || []);
  const [completedCourses, setCompletedCourses] = useState(JSON.parse(localStorage.getItem('completedCourses')) || []);
  const [userName, setUserName] = useState('');
  const [savedUserName, setSavedUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Функція для збереження даних користувача у Firestore
  const saveUserData = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || 'anonymous'; // Замініть на auth.currentUser.uid у продакшені
      await setDoc(doc(db, 'users', userId), {
        name: userName,
        email: userEmail,
        updatedAt: new Date().toISOString(),
      });
      alert('Дані успішно збережено!');
      fetchUserData(); // Оновлюємо відображені дані
    } catch (error) {
      alert('Помилка при збереженні даних: ' + error.message);
    }
  };

  // Функція для читання даних користувача з Firestore
  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous'; // Замініть на auth.currentUser.uid у продакшені
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setSavedUserName(data.name || '');
        setUserEmail(data.email || '');
      } else {
        setSavedUserName('');
        setUserEmail('');
      }
    } catch (error) {
      alert('Помилка при отриманні даних: ' + error.message);
    }
  };

  // Завантажуємо дані користувача при першому рендері
  useEffect(() => {
    fetchUserData();
  }, []);

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