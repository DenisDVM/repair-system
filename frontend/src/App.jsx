import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import TicketsPage from './pages/Tickets';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
