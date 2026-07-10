import { Navigate, Route, Routes } from 'react-router-dom';
import ArenaLayout from './components/ArenaLayout';
import LoginScreen from './components/LoginScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/arena" element={<ArenaLayout />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
