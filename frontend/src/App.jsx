import { Sidebar } from "@/components/layout/Sidebar"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from "./pages/DashboardPage.jsx"
import UsersPage from "./pages/UsersPage.jsx"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
