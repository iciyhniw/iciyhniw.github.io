import { useState } from 'react';

function LoginModal({ showModal, setShowModal, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validEmail = '08andrey1205@gmail.com';
  const validPassword = '12345';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== validEmail || password !== validPassword) {
      alert('Неправильна електронна пошта або пароль!');
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <span className="close" onClick={() => setShowModal(false)}>×</span>
        <h3>Увійти в систему</h3>
        <div id="login-form" onSubmit={handleSubmit}>
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
          <button onClick={handleSubmit}>Увійти</button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
