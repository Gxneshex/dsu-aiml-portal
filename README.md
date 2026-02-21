# 🎓 DSU AI&ML Department Portal

A modern, full-stack web portal for the Department of Artificial Intelligence & Machine Learning at Dhanalakshmi Srinivasan University.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://dsu-aiml-portal.onrender.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🔍 **Student Lookup**: Quick search by registration number
- 👨‍🎓 **Student Management**: Complete student database with 54+ students from 23AIMLA1
- 👨‍🏫 **Faculty Directory**: Department faculty information and profiles
- 📊 **Real-time Stats**: Dashboard with live statistics and analytics
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Particle animations, neural network visualization, smooth transitions
- 🔐 **Admin Panel**: Secure admin interface for data management

## 🚀 Live Demo

Visit the live application: **[dsu-aiml-portal.onrender.com](https://dsu-aiml-portal.onrender.com)**

## 📸 Screenshots

### Home Page
![Home Page] (https://drive.google.com/file/d/1mcpZbtaijWGoCyIvZcxFaKmOw0bmD4Zr/view)

### Student Search
![Student Search](https://drive.google.com/file/d/1au-S8941_w8sRXuGUvjPpzgBptTsm5bW/view)

### Faculty Directory
![Faculty](https://drive.google.com/file/d/1rv8vqCT_mi18TeaQb-7ti4iGj3ydSqZg/view)

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, gradients
- **JavaScript (ES6+)** - Vanilla JS, no frameworks

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Lightweight database

### Deployment
- **Render.com** - Hosting platform
- **Git/GitHub** - Version control

## 📋 Prerequisites

Before running this project locally, make sure you have:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gxneshex/dsu-aiml-portal.git
   cd dsu-aiml-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   node server.js
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
dsu-aiml-portal/
├── index.html          # Home page
├── students.html       # Student search page
├── faculty.html        # Faculty directory
├── gallery.html        # Image gallery
├── timetable.html      # Academic timetable
├── admin.html          # Admin panel
├── home.js            # Home page logic
├── shared.js          # Shared utilities & API calls
├── home.css           # Home page styles
├── shared.css         # Global styles
├── server.js          # Express backend server
├── package.json       # Dependencies & scripts
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## 🎯 API Endpoints

### Students
- `GET /api/students` - Get all students (with filters)
- `GET /api/student/:regNo` - Get student by registration number
- `POST /api/students` - Add new student
- `PUT /api/students/:regNo` - Update student
- `DELETE /api/students/:regNo` - Delete student

### Faculty
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get faculty by ID
- `POST /api/faculty` - Add new faculty
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Stats
- `GET /api/stats` - Get dashboard statistics

### Contact
- `POST /api/contact` - Submit contact form

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=5000
NODE_ENV=production
```

### Database

The SQLite database (`dsu_aiml.db`) is automatically created on first run with:
- ✅ 54 real students from 23AIMLA1 (Year III, Semester 5)
- ✅ Template faculty data (update via admin panel)
- ✅ Contact queries table

## 🎨 Features in Detail

### Interactive Neural Network Animation
Custom canvas animation simulating a neural network with:
- Animated nodes with gradient fills
- Dynamic connections between layers
- Smooth pulse effects
- Rotating outer ring

### Particle System
Background particle effect with:
- 110+ floating particles
- Dynamic connection lines
- Responsive to window resize
- Optimized performance

### Student Quick Lookup
- Real-time search by registration number
- Animated loading states
- Beautiful card-based results
- Complete student profile display

### Responsive Navigation
- Hamburger menu for mobile
- Active page highlighting
- Smooth scroll animations
- Accessible design

## 🚀 Deployment

### Deploy to Render.com

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `PORT=5000`
5. Deploy!

## 👥 Student Data

The portal includes 54 real students from batch **23AIMLA1**:
- Year: III (3rd Year)
- Semester: 5
- Section: A
- Department: AI & Machine Learning

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Admin panel requires authentication (default: admin/aiml@dsu2025)
- Database resets on Render free tier restart (use persistent storage for production)

## 📧 Contact

**Developer**: Ganesh aka Gxneshex
**GitHub**: [@Gxneshex](https://github.com/Gxneshex)  
**Project Link**: [https://github.com/Gxneshex/dsu-aiml-portal](https://github.com/Gxneshex/dsu-aiml-portal)

## 🙏 Acknowledgments

- Dhanalakshmi Srinivasan University
- Department of AI & Machine Learning
- All contributing students and faculty

## 📊 Statistics

- **Students**: 54 from 23AIMLA1
- **Faculty**: Template data (customizable)
- **Tech**: 100% Vanilla JavaScript (no frameworks)
- **Performance**: <100ms API response time
- **Mobile**: Fully responsive design

---

Made with determination by the DSU AI&ML Department
