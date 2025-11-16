// App routes and shared layout (Nav + Footer).

import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Services from './pages/Services.jsx'
import Contact from './pages/Contact.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import EducationForm from './pages/EducationForm.jsx'
import ProjectForm from './pages/ProjectForm.jsx'

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/manage/education" element={<EducationForm />} />
        <Route path="/manage/projects" element={<ProjectForm />} />
      </Routes>
      <footer className="footer">
        © {new Date().getFullYear()} Amirhossein Mohammadi. All rights reserved.
      </footer>
    </div>
  )
}
