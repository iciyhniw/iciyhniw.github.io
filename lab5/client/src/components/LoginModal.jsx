import React, { useState } from 'react';
import '../cssfiles/AuthForm.css';

function LoginModal({ showModal, setShowModal, setIsLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      try {
        const response = await fetch('https://iciyhniw-github-io.onrender.com/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, displayName: name }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Реєстрація не вдалася');
        }
        // Після реєстрації автоматично логінимо користувача через сервер
        const loginResponse = await fetch('https://iciyhniw-github-io.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Вхід після реєстрації не вдався');
        }
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowModal(false);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const response = await fetch('https://iciyhniw-github-io.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Не вдалося увійти. Перевірте ваші дані.');
        }
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        setShowModal(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
      showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>×</span>
              <h2>{isSignUp ? 'Реєстрація' : 'Вхід'}</h2>
              <form onSubmit={handleSubmit}>
                {isSignUp && (
                    <input
                        type="text"
                        placeholder="Ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Електронна пошта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isSignUp ? 'Зареєструватися' : 'Увійти'}</button>
              </form>
              {error && <p className="error">{error}</p>}
              <p>
                {isSignUp ? 'Вже маєте акаунт?' : 'Немає акаунта?'}
                <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? ' Увійти' : ' Зареєструватися'}
            </span>
              </p>
            </div>
          </div>
      )
  );
}

export default LoginModal;