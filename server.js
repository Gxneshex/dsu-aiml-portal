/*
 * ══════════════════════════════════════════════════════════════
 *  DSU AI&ML Portal — server.js
 *  Stack: Node.js · Express · sqlite3 (no build tools needed!)
 * ══════════════════════════════════════════════════════════════
 *  Install:  npm install
 *  Run:      node server.js
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

  /* Seed students - Real data from 23AIMLA1 (3rd Year, Semester 5) */
  const stuRow = await get('SELECT COUNT(*) as n FROM students');
  if (stuRow.n === 0) {
    const students = [
      ['11523110003','AGASH V','III',5,'A','2005-09-22','O+',0.0,85,'TBD','Active'],
      ['11523110004','AGILAN R','III',5,'A','2006-01-21','11523110004@dsu.edu.in','9876540001','O+',0.0,85,'TBD','Active'],
      ['11523110005','AKASH S','III',5,'A','2005-07-08','11523110005@dsu.edu.in','9876540002','O+',0.0,85,'TBD','Active'],
      ['11523110008','ANNAMALAI S','III',5,'A','2005-02-02','11523110008@dsu.edu.in','9876540003','O+',0.0,85,'TBD','Active'],
      ['11523110009','ARAVINTHARAJ G','III',5,'A','2005-06-07','11523110009@dsu.edu.in','9876540004','O+',0.0,85,'TBD','Active'],
      ['11523110014','BANDARU BHAVYA SAI','III',5,'A','2005-07-19','11523110014@dsu.edu.in','9876540005','O+',0.0,85,'TBD','Active'],
      ['11523110015','BATHINI HIMA','III',5,'A','2005-11-20','11523110015@dsu.edu.in','9876540006','O+',0.0,85,'TBD','Active'],
      ['11523110017','BERIN JOEL J','III',5,'A','2006-04-13','11523110017@dsu.edu.in','9876540007','O+',0.0,85,'TBD','Active'],
      ['11523110020','DASARATH R','III',5,'A','2005-09-17','11523110020@dsu.edu.in','9876540008','O+',0.0,85,'TBD','Active'],
      ['11523110021','DEENA DHAYALAN K','III',5,'A','2006-05-22','11523110021@dsu.edu.in','9876540009','O+',0.0,85,'TBD','Active'],
      ['11523110023','ESHWAR R','III',5,'A','2006-01-25','11523110023@dsu.edu.in','9876540010','O+',0.0,85,'TBD','Active'],
      ['11523110026','GANESH R','III',5,'A','2005-09-06','11523110026@dsu.edu.in','9876540011','O+',0.0,85,'TBD','Active'],
      ['11523110030','GOKUL KRISHNAN A','III',5,'A','2005-11-21','11523110030@dsu.edu.in','9876540012','O+',0.0,85,'TBD','Active'],
      ['11523110031','GOLLA VAISHNAVI','III',5,'A','2005-01-07','11523110031@dsu.edu.in','9876540013','O+',0.0,85,'TBD','Active'],
      ['11523110032','HARIPRASATH S','III',5,'A','2005-11-21','11523110032@dsu.edu.in','9876540014','O+',0.0,85,'TBD','Active'],
      ['11523110033','HEMSHREE BHAGAVATHI S','III',5,'A','2006-05-31','11523110033@dsu.edu.in','9876540015','O+',0.0,85,'TBD','Active'],
      ['11523110035','JEYASURYA S','III',5,'A','2006-01-01','11523110035@dsu.edu.in','9876540016','O+',0.0,85,'TBD','Active'],
      ['11523110036','JOMAN L','III',5,'A','2006-05-09','11523110036@dsu.edu.in','9876540017','O+',0.0,85,'TBD','Active'],
      ['11523110039','KARUNYAA C','III',5,'A','2006-08-10','11523110039@dsu.edu.in','9876540018','O+',0.0,85,'TBD','Active'],
      ['11523110040','KISHORE E','III',5,'A','2006-05-02','11523110040@dsu.edu.in','9876540019','O+',0.0,85,'TBD','Active'],
      ['11523110041','KRISHNANALLAMARUTHU L','III',5,'A','2003-08-21','11523110041@dsu.edu.in','9876540020','O+',0.0,85,'TBD','Active'],
      ['11523110069','KUSUMANJALI SIDDI REDDY SIDDI REDDY','III',5,'A','2005-12-17','11523110069@dsu.edu.in','9876540021','O+',0.0,85,'TBD','Active'],
      ['11523110044','LEKSHMI MANIYAN','III',5,'A','2002-09-28','11523110044@dsu.edu.in','9876540022','O+',0.0,85,'TBD','Active'],
      ['11523110045','MADAVAN C','III',5,'A','2006-08-25','11523110045@dsu.edu.in','9876540023','O+',0.0,85,'TBD','Active'],
      ['11523110047','MANONMANI R','III',5,'A','2005-09-30','11523110047@dsu.edu.in','9876540024','O+',0.0,85,'TBD','Active'],
      ['11523110048','MATHESH M','III',5,'A','2006-01-23','11523110048@dsu.edu.in','9876540025','O+',0.0,85,'TBD','Active'],
      ['11523110052','MOHAMMED SHAMEER M','III',5,'A','2005-10-26','11523110052@dsu.edu.in','9876540026','O+',0.0,85,'TBD','Active'],
      ['11523110054','MURUGANANTHAM A','III',5,'A','2006-05-06','11523110054@dsu.edu.in','9876540027','O+',0.0,85,'TBD','Active'],
      ['11523110106','NAGA JOSNA TADIBOAINA','III',5,'A','2005-08-18','11523110106@dsu.edu.in','9876540028','O+',0.0,85,'TBD','Active'],
      ['11523110056','NAVYA C','III',5,'A','2005-10-07','11523110056@dsu.edu.in','9876540029','O+',0.0,85,'TBD','Active'],
      ['11523110058','NIRANJAN KUMAR PR','III',5,'A','2005-10-08','11523110058@dsu.edu.in','9876540030','O+',0.0,85,'TBD','Active'],
      ['11523110080','PARAMASIVAN V','III',5,'A','2006-01-18','11523110080@dsu.edu.in','9876540031','O+',0.0,85,'TBD','Active'],
      ['11523110060','PARTHIBAN P','III',5,'A','2006-03-12','11523110060@dsu.edu.in','9876540032','O+',0.0,85,'TBD','Active'],
      ['11523110082','PERUGU VINNY','III',5,'A','2003-07-16','11523110082@dsu.edu.in','9876540033','O+',0.0,85,'TBD','Active'],
      ['11523110083','PRANAVAN M','III',5,'A','2006-03-19','11523110083@dsu.edu.in','9876540034','O+',0.0,85,'TBD','Active'],
      ['11523110061','PRAVEEN A','III',5,'A','2006-03-17','11523110061@dsu.edu.in','9876540035','O+',0.0,85,'TBD','Active'],
      ['11523110063','PULIGORU SUDHAKAR DEVIKA','III',5,'A','2006-05-24','11523110063@dsu.edu.in','9876540036','O+',0.0,85,'TBD','Active'],
      ['11523110086','RAGAVI S','III',5,'A','2005-09-07','11523110086@dsu.edu.in','9876540037','O+',0.0,85,'TBD','Active'],
      ['11523110087','RAHUL P','III',5,'A','2006-01-05','11523110087@dsu.edu.in','9876540038','O+',0.0,85,'TBD','Active'],
      ['11523110089','RESHMA S','III',5,'A','2005-12-26','11523110089@dsu.edu.in','9876540039','O+',0.0,85,'TBD','Active'],
      ['11523110090','SACHIN M','III',5,'A','2005-10-23','11523110090@dsu.edu.in','9876540040','O+',0.0,85,'TBD','Active'],
      ['11523110091','SAKTHI MAHALAKSHMI K','III',5,'A','2006-06-26','11523110091@dsu.edu.in','9876540041','O+',0.0,85,'TBD','Active'],
      ['11523110093','SANJAI S','III',5,'A','2005-12-08','11523110093@dsu.edu.in','9876540042','O+',0.0,85,'TBD','Active'],
      ['11523110098','SHEIK ABDULLA A','III',5,'A','2005-06-21','11523110098@dsu.edu.in','9876540043','O+',0.0,85,'TBD','Active'],
      ['11523110100','SIVAPRAKASH S','III',5,'A','2004-11-15','11523110100@dsu.edu.in','9876540044','O+',0.0,85,'TBD','Active'],
      ['11523110101','SRI RAM K','III',5,'A','2005-09-14','11523110101@dsu.edu.in','9876540045','O+',0.0,85,'TBD','Active'],
      ['11523110102','SUBASH NAGARAJ V','III',5,'A','2006-05-21','11523110102@dsu.edu.in','9876540046','O+',0.0,85,'TBD','Active'],
      ['11523110109','THANGAMANI K','III',5,'A','2005-10-14','11523110109@dsu.edu.in','9876540047','O+',0.0,85,'TBD','Active'],
      ['11523110110','VAISHALI M','III',5,'A','2006-08-17','11523110110@dsu.edu.in','9876540048','O+',0.0,85,'TBD','Active'],
      ['11523110112','VIGNESH K','III',5,'A','2005-07-20','11523110112@dsu.edu.in','9876540049','O+',0.0,85,'TBD','Active'],
      ['11523110114','VIMAL P','III',5,'A','2006-03-08','11523110114@dsu.edu.in','9876540050','O+',0.0,85,'TBD','Active'],
      ['11523110115','VINOTHRAJ M','III',5,'A','2006-04-08','11523110115@dsu.edu.in','9876540051','O+',0.0,85,'TBD','Active'],
      ['11523110116','VISHALI M','III',5,'A','2006-08-17','11523110116@dsu.edu.in','9876540052','O+',0.0,85,'TBD','Active'],
      ['11523110117','YUVANSANKAR M','III',5,'A','2006-03-21','11523110117@dsu.edu.in','9876540053','O+',0.0,85,'TBD','Active'],
    ];
    for (const s of students) {
      await run(`INSERT INTO students
        (reg_no,name,year,semester,section,dob,email,phone,blood_group,cgpa,attendance,mentor,status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, s);
    }
    console.log('Student seed data inserted (54 students from 23AIMLA1).');
  }

  /* Seed faculty - Template data (update with actual faculty details) */
  const facRow = await get('SELECT COUNT(*) as n FROM faculty');
  if (facRow.n === 0) {
    const faculty = [
      ['Faculty Name 1','HOD & Professor','Ph.D, M.E., B.E.',0,'faculty1@dsu.edu.in','0000000000','Subject 1, Subject 2',1],
      ['Faculty Name 2','Associate Professor','M.E., B.E.',0,'faculty2@dsu.edu.in','0000000000','Subject 3, Subject 4',0],
      ['Faculty Name 3','Assistant Professor','M.Tech, B.E.',0,'faculty3@dsu.edu.in','0000000000','Subject 5, Subject 6',0],
    ];
    for (const f of faculty) {
      await run(`INSERT INTO faculty
        (name,designation,qualification,experience,email,phone,subjects,is_hod)
        VALUES (?,?,?,?,?,?,?,?)`, f);
    }
    console.log('Faculty seed data inserted (template data).');
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
