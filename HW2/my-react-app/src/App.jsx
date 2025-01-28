import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrewDetail from './pages/CrewDetail';
import { LanguageProvider } from './utils/LanguageContext';
import './index.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/crew/:id" element={<CrewDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;