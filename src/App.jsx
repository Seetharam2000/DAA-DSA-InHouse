import { Navigate, Route, Routes } from 'react-router-dom';
import ArenaLayout from './components/ArenaLayout';
import LoginScreen from './components/LoginScreen';
import SettingsPanel from './components/SettingsPanel';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/arena" element={<ArenaLayout />} />
      <Route path="/settings" element={<SettingsPanel />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
