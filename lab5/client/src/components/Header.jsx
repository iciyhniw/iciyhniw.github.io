import { Link, useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';

function Header({ isLoggedIn, setIsLoggedIn, setShowModal }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        // Виклик серверного ендпоінту для виходу
        const response = await fetch('https://iciyhniw-github-io.onrender.com/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Помилка при виході');
        }
      }
      // Виконуємо клієнтський вихід
      await signOut(auth);
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      alert('Помилка при виході: ' + error.message);
    }
  };

  return (
      <header className="header">
        <Link to="/">
          <img src="/images/logo.png" alt="EduWay Logo" className="logo" />
        </Link>
        <nav>
          <ul className="buttons">
            <li>
              <Link to="/schedule" className="nav-button">
                Розклад занять
              </Link>
            </li>
            <li>
              <Link to="/courses" className="nav-button">
                Курси
              </Link>
            </li>
            {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/profile" className="nav-button">
                      Мій кабінет
                    </Link>
                  </li>
                  <li>
                    <button className="nav-button" onClick={handleLogout}>
                      Вийти
                    </button>
                  </li>
                </>
            ) : (
                <li>
                  <button className="nav-button" onClick={() => setShowModal(true)}>
                    Увійти
                  </button>
                </li>
            )}
          </ul>
        </nav>
      </header>
  );
}

export default Header;