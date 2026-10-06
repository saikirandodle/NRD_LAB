import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Students from './pages/Students.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';

const Protected = ({ children }) => (localStorage.getItem('token') ? children : <Navigate to="/login" replace />);

export default function App() {
  const nav = useNavigate();
  const loggedIn = !!localStorage.getItem('token');
  const logout = () => { localStorage.clear(); nav('/login'); };
  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '');
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary">
        <div className="container">
          <NavLink className="navbar-brand" to="/">BVRIT Student Management</NavLink>
          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv"><span className="navbar-toggler-icon" /></button>
          <div className="collapse navbar-collapse" id="nv">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><NavLink className={link} to="/" end>Home</NavLink></li>
              {loggedIn && <li className="nav-item"><NavLink className={link} to="/students">Students</NavLink></li>}
              <li className="nav-item"><NavLink className={link} to="/about">About</NavLink></li>
              <li className="nav-item"><NavLink className={link} to="/contact">Contact</NavLink></li>
              {loggedIn ? (
                <li className="nav-item"><button className="btn btn-light btn-sm ms-2" onClick={logout}>Logout ({localStorage.getItem('name')})</button></li>
              ) : (<>
                <li className="nav-item"><NavLink className={link} to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className={link} to="/register">Register</NavLink></li>
              </>)}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/students" element={<Protected><Students /></Protected>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer className="text-center text-muted py-3 border-top">© BVRIT Narsapur</footer>
    </>
  );
}
