import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth';
import { toast } from 'react-toastify';
import firebase from '../FirebaseConf';

const { auth } = firebase;

function LoginModal({ showModal, setShowModal, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          throw new Error('Помилка реєстрації');
        }
        const { idToken, uid } = await response.json();
        await signInWithCustomToken(auth, idToken);
        localStorage.setItem('userId', uid);
        setIsLoggedIn(true);
        toast.success(`Користувача створено: ${email}`, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
        if (!response.ok) {
          throw new Error('Помилка входу');
        }
        const { uid } = await response.json();
        localStorage.setItem('userId', uid);
        setIsLoggedIn(true);
        toast.success(`Успішний вхід: ${email}`, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
      setShowModal(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(`Помилка: ${error.message}`, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
      });
    }
  };

  if (!showModal) return null;

  return (
      <div className="modal" style={{ display: 'flex' }}>
        <div className="modal-content">
          <span className="close" onClick={() => setShowModal(false)}>×</span>
          <h3>{isSignUp ? 'Реєстрація' : 'Увійти в систему'}</h3>
          <form id="auth-form" onSubmit={handleSubmit}>
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
            <button type="submit">
              {isSignUp ? 'Зареєструватися' : 'Увійти'}
            </button>
            <button
                type="button"
                className="toggle-auth-btn"
                onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>
        </div>
      </div>
  );
}

export default LoginModal;
