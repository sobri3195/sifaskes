import logo from '../assets/sifaskes-logo.svg';

function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <img src={logo} alt="Logo SiFaskes" className="header-logo" />
        <div className="header-text">
          <h1>SiFaskes</h1>
          <p>Sistem Informasi Fasilitas Kesehatan</p>
        </div>
      </div>
      <span className="tagline">Peta Profil RSAU & FKTP Jajaran TNI AU</span>
    </header>
  );
}

export default Header;
