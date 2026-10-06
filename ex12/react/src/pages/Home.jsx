import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-5 bg-light rounded text-center">
      <h1>Student Management System</h1>
      <p className="lead">BVRIT Narsapur — manage student records, import from Excel, search, sort and filter.</p>
      <Link to="/students" className="btn btn-primary me-2">Go to Students</Link>
      <Link to="/register" className="btn btn-outline-primary">Register</Link>
    </div>
  );
}
