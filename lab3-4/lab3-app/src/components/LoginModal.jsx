import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from '../FirebaseConf';

const { auth } = firebase;

function LoginModal({ showModal, setShowModal, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert('Користувача створено: ' + userCredential.user.email);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('Успішний вхід: ' + userCredential.user.email);
      }
      localStorage.setItem('userId', userCredential.user.uid); // Зберігаємо userId
      setIsLoggedIn(true);
      setShowModal(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Помилка: ' + error.message);
    }
  };

  if (!showModal) return null;

  return (
      <div className="modal" style={{ display: 'flex' }}>
        <div className="modal-content">
          <span className="close" onClick={() => setShowModal(false)}>×</span>
          <h3>{isSignUp ? 'Реєстрація' : 'Увійти в систему'}</h3>
          <div id="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Електронна пошта:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label htmlFor="password">Пароль:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button onClick={handleSubmit}>{isSignUp ? 'Зареєструватися' : 'Увійти'}</button>
            <button
                type="button"
                className="toggle-auth-btn"
                onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Увійти' : 'Зареєструватися'}
            </button>
          </div>
        </div>
      </div>
  );
}

export default LoginModal;