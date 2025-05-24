import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import firebase from '../../FirebaseConf';

const { auth } = firebase;
function Header({ isLoggedIn, setIsLoggedIn, setShowModal }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
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