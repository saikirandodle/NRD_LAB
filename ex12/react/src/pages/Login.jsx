import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';

export default function Login() {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const ch = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      nav('/students');
      window.location.reload();
    } catch (x) { setErr(x.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="row justify-content-center"><div className="col-md-5">
      <h3>Login</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" required value={f.email} onChange={ch} />
        <input className="form-control mb-3" type="password" name="password" placeholder="Password" required value={f.password} onChange={ch} />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="mt-3">New user? <Link to="/register">Register</Link></p>
    </div></div>
  );
}
