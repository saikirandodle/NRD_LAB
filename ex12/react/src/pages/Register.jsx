import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api.js';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const ch = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/auth/register', f); nav('/login'); }
    catch (x) { setErr(x.response?.data?.message || 'Registration failed'); }
  };
  return (
    <div className="row justify-content-center"><div className="col-md-5">
      <h3>Register</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submit}>
        <input className="form-control mb-2" name="name" placeholder="Name" required value={f.name} onChange={ch} />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" required value={f.email} onChange={ch} />
        <input className="form-control mb-3" type="password" name="password" placeholder="Password (min 6)" minLength={6} required value={f.password} onChange={ch} />
        <button className="btn btn-primary w-100">Register</button>
      </form>
      <p className="mt-3">Have an account? <Link to="/login">Login</Link></p>
    </div></div>
  );
}
