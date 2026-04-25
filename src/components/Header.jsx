import logo from '../assets/sifaskes-logo.svg';

function Header({ loggedInUser, onLogout }) {
  return (
    <header className="header">
      <div className="header-brand">
        <img src={logo} alt="Logo SiFaskes" className="header-logo" />
        <div>
          <h1>SiFaskes</h1>
          <p>Sistem Informasi Fasilitas Kesehatan</p>
        </div>
      </div>
      <div className="header-right">
        <span className="tagline">Peta Profil RSAU & FKTP Jajaran TNI AU</span>
        {loggedInUser ? (
          <div className="auth-status">
            <span>Login: <strong>{loggedInUser.name}</strong></span>
            <button type="button" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <span className="auth-status auth-status--guest">Guest (hanya lihat data)</span>
        )}
      </div>
    </header>
  );
}

export default Header;
