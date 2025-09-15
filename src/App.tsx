

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { SelectedDateProvider } from './context/SelectedDateContext';

import Sales from './pages/Sales';
import Account from './pages/Account';
import BackupRestore from './components/BackupRestore';

function App() {
  return (
    <SelectedDateProvider>
      <Router>
        <nav style={{ display: 'flex', gap: 16, padding: 16, background: '#f5f5f5' }}>
          <Link to="/sales">Satış</Link>
          <Link to="/account">Hesap</Link>
        </nav>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <BackupRestore />
        </div>
        <Routes>
          <Route path="/sales" element={<Sales />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/sales" replace />} />
        </Routes>
      </Router>
    </SelectedDateProvider>
  );
}

export default App;
