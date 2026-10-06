import { useCallback, useEffect, useState } from 'react';
import api from '../api.js';

const DEPTS = ['CSE', 'ECE', 'EEE', 'IT'];
const YEARS = ['I', 'II', 'III', 'IV'];
const EMPTY = { studentId: '', name: '', dept: 'CSE', mobileno: '', year: 'I' };
const COLS = [['studentId', 'ID'], ['name', 'Name'], ['dept', 'Dept'], ['mobileno', 'Mobile No'], ['year', 'Year']];

export default function Students() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [q, setQ] = useState({ page: 1, limit: 10, sortBy: 'studentId', order: 'asc', search: '', dept: '', year: '' });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/students', { params: q });
      setRows(data.data); setMeta({ total: data.total, pages: data.pages });
    } catch (e) {
      if (e.response?.status === 401) { localStorage.clear(); window.location.href = '/login'; }
      else setMsg({ t: 'danger', m: 'Failed to load students' });
    }
  }, [q]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const id = setTimeout(() => setQ((p) => (p.search === search ? p : { ...p, search, page: 1 })), 300);
    return () => clearTimeout(id);
  }, [search]);

  const set = (k, v) => setQ((p) => ({ ...p, [k]: v, page: k === 'page' ? v : 1 }));
  const sort = (c) => setQ((p) => ({ ...p, sortBy: c, order: p.sortBy === c && p.order === 'asc' ? 'desc' : 'asc', page: 1 }));

  const save = async (e) => {
    e.preventDefault();
    try {
      editId ? await api.put(`/students/${editId}`, form) : await api.post('/students', form);
      setForm(null); setEditId(null);
      setMsg({ t: 'success', m: editId ? 'Student updated' : 'Student added' });
      load();
    } catch (x) { setMsg({ t: 'danger', m: x.response?.data?.message || 'Save failed' }); }
  };
  const del = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return;
    await api.delete(`/students/${s._id}`);
    setMsg({ t: 'success', m: 'Student deleted' });
    if (rows.length === 1 && q.page > 1) set('page', q.page - 1); else load();
  };
  const upload = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try {
      const { data } = await api.post('/students/upload', fd);
      setMsg({ t: data.inserted ? 'success' : 'warning', m: `Inserted ${data.inserted}, skipped ${data.skipped}. ${data.errors.join('; ')}` });
      load();
    } catch (x) { setMsg({ t: 'danger', m: x.response?.data?.message || 'Upload failed' }); }
  };
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h3 className="m-0">Students ({meta.total})</h3>
        <div className="d-flex gap-2">
          <label className="btn btn-outline-success mb-0">Upload Excel
            <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={upload} />
          </label>
          <button className="btn btn-primary" onClick={() => { setEditId(null); setForm(EMPTY); }}>+ Add Student</button>
        </div>
      </div>
      <p className="text-muted small">Excel columns: id, name, dept (CSE/ECE/EEE/IT), mobileno (10 digits), year (I/II/III/IV)</p>
      {msg && <div className={`alert alert-${msg.t} alert-dismissible`}>{msg.m}<button className="btn-close" onClick={() => setMsg(null)} /></div>}

      <div className="row g-2 mb-3">
        <div className="col-md-5"><input className="form-control" placeholder="Search name / id / mobile" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="col-6 col-md-2"><select className="form-select" value={q.dept} onChange={(e) => set('dept', e.target.value)}><option value="">All Depts</option>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select></div>
        <div className="col-6 col-md-2"><select className="form-select" value={q.year} onChange={(e) => set('year', e.target.value)}><option value="">All Years</option>{YEARS.map((d) => <option key={d}>{d}</option>)}</select></div>
        <div className="col-md-3"><select className="form-select" value={q.limit} onChange={(e) => set('limit', +e.target.value)}>{[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n} per page</option>)}</select></div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark"><tr>
            {COLS.map(([k, l]) => <th key={k} role="button" onClick={() => sort(k)}>{l}{q.sortBy === k ? (q.order === 'asc' ? ' ?' : ' ?') : ''}</th>)}
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No students found</td></tr>}
            {rows.map((s) => (
              <tr key={s._id}>
                <td>{s.studentId}</td><td>{s.name}</td><td>{s.dept}</td><td>{s.mobileno}</td><td>{s.year}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => { setEditId(s._id); setForm({ studentId: s.studentId, name: s.name, dept: s.dept, mobileno: s.mobileno, year: s.year }); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav><ul className="pagination justify-content-center">
        <li className={`page-item ${q.page <= 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => set('page', q.page - 1)}>Prev</button></li>
        {Array.from({ length: meta.pages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === meta.pages || Math.abs(p - q.page) <= 2)
          .map((p) => <li key={p} className={`page-item ${p === q.page ? 'active' : ''}`}><button className="page-link" onClick={() => set('page', p)}>{p}</button></li>)}
        <li className={`page-item ${q.page >= meta.pages ? 'disabled' : ''}`}><button className="page-link" onClick={() => set('page', q.page + 1)}>Next</button></li>
      </ul></nav>

      {form && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog"><form className="modal-content" onSubmit={save}>
            <div className="modal-header"><h5 className="modal-title">{editId ? 'Edit' : 'Add'} Student</h5><button type="button" className="btn-close" onClick={() => setForm(null)} /></div>
            <div className="modal-body">
              <input className="form-control mb-2" name="studentId" placeholder="Student ID" required value={form.studentId} onChange={ch} />
              <input className="form-control mb-2" name="name" placeholder="Name" required value={form.name} onChange={ch} />
              <select className="form-select mb-2" name="dept" value={form.dept} onChange={ch}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
              <input className="form-control mb-2" name="mobileno" placeholder="Mobile No (10 digits)" pattern="\d{10}" required value={form.mobileno} onChange={ch} />
              <select className="form-select" name="year" value={form.year} onChange={ch}>{YEARS.map((d) => <option key={d}>{d}</option>)}</select>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-primary">{editId ? 'Update' : 'Add'}</button></div>
          </form></div>
        </div>
      )}
    </div>
  );
}
