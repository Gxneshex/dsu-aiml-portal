/*
 * ══════════════════════════════════════════════════════════════
 *  DSU AI&ML Portal — server.js
 *  Stack: Node.js · Express · sqlite3 (no build tools needed!)
 * ══════════════════════════════════════════════════════════════
 *  Install:  npm install
 *  Run:      node server.js
 *  Open:     http://localhost:5000
 * ══════════════════════════════════════════════════════════════
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const sqlite3 = require('sqlite3').verbose();

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── MIDDLEWARE ──────────────────────────────────────────── */
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serves all HTML/CSS/JS

/* ── DATABASE SETUP ──────────────────────────────────────── */
const db = new sqlite3.Database(path.join(__dirname, 'dsu_aiml.db'), err => {
  if (err) { console.error('DB Error:', err.message); process.exit(1); }
  console.log('Connected to SQLite database.');
});

/* Promise helpers */
function run(sql, params = []) {
  return new Promise((res, rej) => {
    db.run(sql, params, function(err) { if (err) rej(err); else res(this); });
  });
}
function all(sql, params = []) {
  return new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => { if (err) rej(err); else res(rows); });
  });
}
function get(sql, params = []) {
  return new Promise((res, rej) => {
    db.get(sql, params, (err, row) => { if (err) rej(err); else res(row); });
  });
}

/* ── CREATE TABLES & SEED ────────────────────────────────── */
async function initDB() {
  await run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reg_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    programme TEXT DEFAULT 'B.Tech Artificial Intelligence & Machine Learning',
    year TEXT, semester INTEGER, section TEXT, dob TEXT,
    email TEXT, phone TEXT, blood_group TEXT,
    cgpa REAL DEFAULT 0, attendance REAL DEFAULT 0,
    mentor TEXT, status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    designation TEXT DEFAULT 'Assistant Professor',
    qualification TEXT, experience INTEGER DEFAULT 0,
    email TEXT, phone TEXT, subjects TEXT, is_hod INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS contact_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT, type TEXT, message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  /* Seed students */
  const stuRow = await get('SELECT COUNT(*) as n FROM students');
  if (stuRow.n === 0) {
    const students = [
      ['2122AIML001','Aravind Ramasamy',     'III',5,'A','2003-04-12','aravind.r@dsu.edu.in',  '9876543210','O+', 8.7,89,'Dr. S. Ananthi',   'Active'],
      ['2122AIML002','Priya Sundaram',       'III',5,'A','2003-07-22','priya.s@dsu.edu.in',    '9876543211','A+', 9.1,94,'Dr. S. Ananthi',   'Active'],
      ['2122AIML003','Karthik Murugan',      'III',5,'B','2003-01-08','karthik.m@dsu.edu.in',  '9876543212','B+', 7.5,71,'Prof. R. Kavitha', 'Active'],
      ['2122AIML004','Divya Krishnamurthy',  'III',5,'B','2003-11-30','divya.k@dsu.edu.in',    '9876543213','AB+',8.2,82,'Prof. R. Kavitha', 'Active'],
      ['2122AIML005','Rohith Selvaraj',      'III',5,'A','2003-03-15','rohith.s@dsu.edu.in',   '9876543214','O-', 6.9,65,'Dr. S. Ananthi',   'Active'],
      ['2122AIML006','Nithya Rajendran',     'III',5,'A','2003-06-20','nithya.r@dsu.edu.in',   '9876543215','B-', 8.9,91,'Dr. S. Ananthi',   'Active'],
      ['2122AIML007','Surya Prakash',        'III',5,'B','2003-09-11','surya.p@dsu.edu.in',    '9876543216','A-', 7.8,77,'Prof. R. Kavitha', 'Active'],
      ['2223AIML001','Meenakshi Pillai',     'II', 3,'A','2004-09-05','meena.p@dsu.edu.in',    '9876543220','A-', 9.3,97,'Dr. V. Rajkumar',  'Active'],
      ['2223AIML002','Vishal Narayanan',     'II', 3,'A','2004-12-19','vishal.n@dsu.edu.in',   '9876543221','B-', 7.8,78,'Dr. V. Rajkumar',  'Active'],
      ['2223AIML003','Lavanya Subramanian',  'II', 3,'B','2004-06-25','lavanya.s@dsu.edu.in',  '9876543222','O+', 8.5,91,'Prof. M. Priya',   'Active'],
      ['2223AIML004','Harish Balaji',        'II', 3,'B','2004-02-14','harish.b@dsu.edu.in',   '9876543223','A+', 8.0,85,'Prof. M. Priya',   'Active'],
      ['2223AIML005','Anitha Ravi',          'II', 3,'A','2004-08-30','anitha.r@dsu.edu.in',   '9876543224','AB-',9.0,93,'Dr. V. Rajkumar',  'Active'],
      ['2324AIML001','Arjun Balakrishnan',   'I',  1,'A','2005-02-14','arjun.b@dsu.edu.in',    '9876543230','A+', 0.0,88,'Dr. S. Ananthi',   'Active'],
      ['2324AIML002','Keerthana Murugesan',  'I',  1,'A','2005-05-18','keerthana.m@dsu.edu.in','9876543231','O+', 0.0,90,'Dr. S. Ananthi',   'Active'],
      ['2324AIML003','Dinesh Prabhu',        'I',  1,'B','2005-03-22','dinesh.p@dsu.edu.in',   '9876543232','B+', 0.0,75,'Prof. R. Kavitha', 'Active'],
      ['2021AIML001','Soundarya Rajan',      'IV', 7,'A','2002-08-10','soundarya.r@dsu.edu.in','9876543200','B+', 9.0,93,'Dr. V. Rajkumar',  'Active'],
      ['2021AIML002','Elan Chezhiyan',       'IV', 7,'B','2002-05-27','elan.c@dsu.edu.in',     '9876543201','AB-',7.2,60,'Prof. R. Kavitha', 'Inactive'],
      ['2021AIML003','Pavithra Mani',        'IV', 7,'A','2002-11-03','pavithra.m@dsu.edu.in', '9876543202','O-', 8.6,87,'Dr. V. Rajkumar',  'Active'],
    ];
    for (const s of students) {
      await run(`INSERT INTO students
        (reg_no,name,year,semester,section,dob,email,phone,blood_group,cgpa,attendance,mentor,status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, s);
    }
    console.log('Student seed data inserted (18 students).');
  }

  /* Seed faculty */
  const facRow = await get('SELECT COUNT(*) as n FROM faculty');
  if (facRow.n === 0) {
    const faculty = [
      ['Dr. S. Ananthi',        'HOD & Professor',       'Ph.D (AI), M.E., B.E.',        18,'ananthi.s@dsu.edu.in',  '9876540001','Deep Learning, Neural Networks, Research Methods',1],
      ['Prof. R. Kavitha',      'Associate Professor',    'M.E. (CSE), B.E.',             12,'kavitha.r@dsu.edu.in',  '9876540002','Natural Language Processing, Machine Learning, Python',0],
      ['Dr. V. Rajkumar',       'Associate Professor',    'Ph.D (Data Science), M.Tech.', 15,'rajkumar.v@dsu.edu.in', '9876540003','Big Data Analytics, Cloud Computing, Database Systems',0],
      ['Prof. M. Priya',        'Assistant Professor',    'M.Tech (IT), B.E.',             8,'priya.m@dsu.edu.in',    '9876540004','IoT and Embedded Systems, Computer Networks',0],
      ['Dr. K. Senthilkumar',   'Professor',              'Ph.D (ML), M.E., B.E.',        20,'senthil.k@dsu.edu.in', '9876540005','Computer Vision, Image Processing, AI Fundamentals',0],
      ['Prof. A. Vijayalakshmi','Assistant Professor',    'M.E. (CSE), B.E.',              6,'vijaya.a@dsu.edu.in',   '9876540006','Data Structures, Algorithms, Discrete Mathematics',0],
      ['Prof. P. Suresh',       'Assistant Professor',    'M.Tech (AI), B.E.',             5,'suresh.p@dsu.edu.in',   '9876540007','Reinforcement Learning, Probability & Statistics',0],
      ['Dr. R. Maheswari',      'Associate Professor',    'Ph.D (Networks), M.E.',        14,'mahes.r@dsu.edu.in',    '9876540008','Software Engineering, Agile Methods, Project Management',0],
      ['Prof. T. Kalaivani',    'Assistant Professor',    'M.Sc (CS), B.Sc.',              7,'kalaivani.t@dsu.edu.in','9876540009','Mathematics for AI, Linear Algebra, Calculus',0],
    ];
    for (const f of faculty) {
      await run(`INSERT INTO faculty
        (name,designation,qualification,experience,email,phone,subjects,is_hod)
        VALUES (?,?,?,?,?,?,?,?)`, f);
    }
    console.log('Faculty seed data inserted (9 faculty).');
  }
}

/* ══════════════════════════════════════════════
   STUDENT ROUTES
══════════════════════════════════════════════ */
app.get('/api/student/:regNo', async (req, res) => {
  const reg = req.params.regNo.trim().toUpperCase();
  if (!reg || reg.length < 5)
    return res.status(400).json({ success:false, message:'Invalid registration number.' });
  try {
    const s = await get('SELECT * FROM students WHERE UPPER(reg_no)=?', [reg]);
    if (!s) return res.status(404).json({ success:false, message:`No student found: ${reg}` });
    const { id, created_at, ...safe } = s;
    return res.json({ success:true, student:safe });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.get('/api/students', async (req, res) => {
  const { year, section, status, search } = req.query;
  let q = 'SELECT reg_no,name,year,semester,section,cgpa,attendance,status FROM students WHERE 1=1';
  const args = [];
  if (year)    { q += ' AND year=?';                         args.push(year); }
  if (section) { q += ' AND UPPER(section)=?';               args.push(section.toUpperCase()); }
  if (status)  { q += ' AND LOWER(status)=?';                args.push(status.toLowerCase()); }
  if (search)  { q += ' AND (name LIKE ? OR reg_no LIKE ?)'; args.push(`%${search}%`,`%${search}%`); }
  q += ' ORDER BY year ASC, reg_no ASC';
  try {
    const rows = await all(q, args);
    return res.json({ success:true, count:rows.length, students:rows });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.post('/api/students', async (req, res) => {
  const { reg_no,name,year,semester,section,dob,email,phone,
          blood_group,cgpa,attendance,mentor,status } = req.body;
  if (!reg_no || !name)
    return res.status(400).json({ success:false, message:'reg_no and name are required.' });
  try {
    await run(`INSERT INTO students
      (reg_no,name,year,semester,section,dob,email,phone,blood_group,cgpa,attendance,mentor,status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [reg_no.toUpperCase().trim(),name,year,semester||null,section,
       dob,email,phone,blood_group,cgpa||0,attendance||0,mentor,status||'Active']);
    return res.status(201).json({ success:true, message:'Student added successfully.' });
  } catch(e) {
    if (e.message.includes('UNIQUE'))
      return res.status(409).json({ success:false, message:'Registration number already exists.' });
    return res.status(500).json({ success:false, message:'Server error.' });
  }
});

app.put('/api/students/:regNo', async (req, res) => {
  const reg = req.params.regNo.trim().toUpperCase();
  const allowed = ['name','year','semester','section','dob','email','phone',
                   'blood_group','cgpa','attendance','mentor','status'];
  const fields = Object.keys(req.body).filter(k => allowed.includes(k));
  if (!fields.length)
    return res.status(400).json({ success:false, message:'No valid fields.' });
  const set  = fields.map(f=>`${f}=?`).join(', ');
  const vals = [...fields.map(f=>req.body[f]), reg];
  try {
    const r = await run(`UPDATE students SET ${set} WHERE UPPER(reg_no)=?`, vals);
    if (!r.changes) return res.status(404).json({ success:false, message:'Student not found.' });
    return res.json({ success:true, message:'Student updated.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.delete('/api/students/:regNo', async (req, res) => {
  const reg = req.params.regNo.trim().toUpperCase();
  try {
    const r = await run('DELETE FROM students WHERE UPPER(reg_no)=?', [reg]);
    if (!r.changes) return res.status(404).json({ success:false, message:'Student not found.' });
    return res.json({ success:true, message:'Student deleted.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

/* ══════════════════════════════════════════════
   FACULTY ROUTES
══════════════════════════════════════════════ */
app.get('/api/faculty', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM faculty ORDER BY is_hod DESC, experience DESC');
    return res.json({ success:true, count:rows.length, faculty:rows });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.get('/api/faculty/:id', async (req, res) => {
  try {
    const f = await get('SELECT * FROM faculty WHERE id=?', [+req.params.id]);
    if (!f) return res.status(404).json({ success:false, message:'Faculty not found.' });
    return res.json({ success:true, faculty:f });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.post('/api/faculty', async (req, res) => {
  const { name,designation,qualification,experience,email,phone,subjects,is_hod } = req.body;
  if (!name) return res.status(400).json({ success:false, message:'Name is required.' });
  try {
    await run(`INSERT INTO faculty (name,designation,qualification,experience,email,phone,subjects,is_hod)
      VALUES (?,?,?,?,?,?,?,?)`,
      [name,designation||'Assistant Professor',qualification,experience||0,
       email,phone,subjects,is_hod?1:0]);
    return res.status(201).json({ success:true, message:'Faculty added.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.put('/api/faculty/:id', async (req, res) => {
  const allowed = ['name','designation','qualification','experience','email','phone','subjects','is_hod'];
  const fields  = Object.keys(req.body).filter(k => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ success:false, message:'No valid fields.' });
  const set  = fields.map(f=>`${f}=?`).join(', ');
  const vals = [...fields.map(f=>req.body[f]), +req.params.id];
  try {
    const r = await run(`UPDATE faculty SET ${set} WHERE id=?`, vals);
    if (!r.changes) return res.status(404).json({ success:false, message:'Faculty not found.' });
    return res.json({ success:true, message:'Faculty updated.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.delete('/api/faculty/:id', async (req, res) => {
  try {
    const r = await run('DELETE FROM faculty WHERE id=?', [+req.params.id]);
    if (!r.changes) return res.status(404).json({ success:false, message:'Faculty not found.' });
    return res.json({ success:true, message:'Faculty deleted.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

/* ══════════════════════════════════════════════
   STATS & CONTACT
══════════════════════════════════════════════ */
app.get('/api/stats', async (req, res) => {
  try {
    const total    = (await get('SELECT COUNT(*) as n FROM students')).n;
    const active   = (await get("SELECT COUNT(*) as n FROM students WHERE LOWER(status)='active'")).n;
    const cgpaRow  = await get('SELECT ROUND(AVG(cgpa),2) as v FROM students WHERE cgpa>0');
    const attRow   = await get('SELECT ROUND(AVG(attendance),1) as v FROM students');
    const facTotal = (await get('SELECT COUNT(*) as n FROM faculty')).n;
    return res.json({ success:true, stats:{
      total, active, avgCgpa:cgpaRow.v||0, avgAttendance:attRow.v||0, faculty:facTotal
    }});
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.post('/api/contact', async (req, res) => {
  const { name,email,type,message } = req.body;
  if (!name||!email||!message)
    return res.status(400).json({ success:false, message:'Name, email and message required.' });
  try {
    await run('INSERT INTO contact_queries (name,email,type,message) VALUES (?,?,?,?)',
              [name,email,type,message]);
    return res.json({ success:true, message:'Query received.' });
  } catch(e) { return res.status(500).json({ success:false, message:'Server error.' }); }
});

app.use((req,res) => res.status(404).json({ success:false, message:'Route not found.' }));

/* ── START ───────────────────────────────────────────────── */
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n DSU AI&ML Portal → http://localhost:${PORT}`);
    console.log(`  Open your browser at: http://localhost:${PORT}\n`);
  });
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
