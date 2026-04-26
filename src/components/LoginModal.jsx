import { useState } from 'react';
import { demoUsers } from '../utils/auth';

function LoginModal({ onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onSubmit(username, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal auth-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3>Login Multi User</h3>
        <p className="auth-note">Login hanya dibutuhkan untuk tambah dan edit data fasilitas.</p>

        <form className="facility-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="contoh: admin.pusat"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="demo-user-list">
          <p>Akun demo:</p>
          <ul>
            {demoUsers.map((item) => (
              <li key={item.username}>
                <strong>{item.name}</strong> — {item.username} / {item.password}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
