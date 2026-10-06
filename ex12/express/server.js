require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });
const SECRET = process.env.JWT_SECRET || 'dev-secret';
const DEPTS = ['CSE', 'ECE', 'EEE', 'IT'];
const YEARS = ['I', 'II', 'III', 'IV'];

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}));
const Student = mongoose.model('Student', new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  dept: { type: String, required: true, enum: DEPTS },
  mobileno: { type: String, required: true, match: /^\d{10}$/ },
  year: { type: String, required: true, enum: YEARS },
}, { timestamps: true }));

const auth = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = jwt.verify(t, SECRET); next(); }
  catch { res.status(401).json({ message: 'Unauthorized' }); }
};
const errMsg = (e) => e.code === 11000 ? 'Student ID already exists' : e.message;

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Name, email and password (min 6 chars) required' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ message: 'Registered', id: user._id });
  } catch (e) {
    res.status(400).json({ message: e.code === 11000 ? 'Email already registered' : e.message });
  }
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user._id, name: user.name }, SECRET, { expiresIn: '8h' });
  res.json({ token, name: user.name });
});

app.get('/api/students', auth, async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'studentId', order = 'asc', search = '', dept = '', year = '' } = req.query;
  const q = {};
  if (dept) q.dept = dept;
  if (year) q.year = year;
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    q.$or = [{ name: rx }, { studentId: rx }, { mobileno: rx }];
  }
  const field = ['studentId', 'name', 'dept', 'mobileno', 'year'].includes(sortBy) ? sortBy : 'studentId';
  const lim = Math.min(100, Math.max(1, +limit || 10));
  const pg = Math.max(1, +page || 1);
  const [total, data] = await Promise.all([
    Student.countDocuments(q),
    Student.find(q).sort({ [field]: order === 'desc' ? -1 : 1 }).skip((pg - 1) * lim).limit(lim),
  ]);
  res.json({ data, total, page: pg, pages: Math.ceil(total / lim) });
});
app.post('/api/students', auth, async (req, res) => {
  try { res.status(201).json(await Student.create(req.body)); }
  catch (e) { res.status(400).json({ message: errMsg(e) }); }
});
app.put('/api/students/:id', auth, async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    s ? res.json(s) : res.status(404).json({ message: 'Not found' });
  } catch (e) { res.status(400).json({ message: errMsg(e) }); }
});
app.delete('/api/students/:id', auth, async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id);
  s ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' });
});

// Excel columns: id, name, dept, mobileno, year
app.post('/api/students/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
    const docs = [], errors = [];
    rows.forEach((r, i) => {
      const k = {};
      Object.keys(r).forEach((key) => (k[key.toString().trim().toLowerCase().replace(/[\s_]/g, '')] = r[key]));
      const d = {
        studentId: String(k.id ?? k.studentid ?? '').trim(),
        name: String(k.name ?? '').trim(),
        dept: String(k.dept ?? '').trim().toUpperCase(),
        mobileno: String(k.mobileno ?? k.mobile ?? '').trim(),
        year: String(k.year ?? '').trim().toUpperCase(),
      };
      const bad = !d.studentId || !d.name || !DEPTS.includes(d.dept) || !/^\d{10}$/.test(d.mobileno) || !YEARS.includes(d.year);
      bad ? errors.push(`Row ${i + 2}: invalid data`) : docs.push(d);
    });
    let inserted = 0;
    try { inserted = (await Student.insertMany(docs, { ordered: false })).length; }
    catch (e) {
      inserted = e.insertedDocs ? e.insertedDocs.length : (e.result?.insertedCount ?? 0);
      (e.writeErrors || []).forEach((w) => errors.push(`Duplicate ID: ${docs[w.index]?.studentId}`));
    }
    res.json({ inserted, skipped: rows.length - inserted, errors: errors.slice(0, 20) });
  } catch (e) { res.status(400).json({ message: 'Could not read file: ' + e.message }); }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_management')
  .then(() => app.listen(PORT, () => console.log('API on ' + PORT)))
  .catch((e) => { console.error('Mongo connection failed', e.message); process.exit(1); });
