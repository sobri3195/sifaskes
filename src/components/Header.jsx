import logo from '../assets/sifaskes-logo.svg';

function Header({ currentUser, onLogin, onLogout }) {
  return (
    <header className="header">
      <div className="header-brand">
        <img src={logo} alt="Logo SiFaskes" className="header-logo" />
        <div className="header-text">
          <h1>SiFaskes</h1>
          <p>Sistem Informasi Fasilitas Kesehatan</p>
        </div>
      </div>

      <div className="header-auth">
        <span className="tagline">Peta Profil RSAU & FKTP Jajaran TNI AU</span>
        {currentUser ? (
          <div className="auth-actions">
            <span className="auth-user">{currentUser.name}</span>
            <button type="button" className="secondary-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button type="button" className="secondary-btn" onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
