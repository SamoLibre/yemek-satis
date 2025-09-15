import React, { useState } from 'react';
import { useSelectedDate } from '../context/SelectedDateContext';
import { students } from '../data/students';
import type { Student } from '../data/students';
import { menuItems } from '../data/menuItems';
import { getDateKey } from '../utils/dateKey';

// Types
export type PaymentType = 'nakit' | 'kredi';
export type SavedMenu = {
  student: Student;
  menu: string[];
  date: string;
  payment?: PaymentType;
};

function getSavedMenus(date: string): SavedMenu[] {
  const key = `savedMenus-${getDateKey(date)}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}
function setSavedMenus(date: string, menus: SavedMenu[]) {
  const key = `savedMenus-${getDateKey(date)}`;
  localStorage.setItem(key, JSON.stringify(menus));
}

export default function Sales() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [selectedClass, setSelectedClass] = useState<'9. Sınıf'|'10. Sınıf'|'11. Sınıf'|'12. Sınıf'>('9. Sınıf');
  const [drawerStudent, setDrawerStudent] = useState<Student|null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const [savedMenus, setSavedMenusState] = useState(() => getSavedMenus(selectedDate));

  React.useEffect(() => {
    setSavedMenusState(getSavedMenus(selectedDate));
  }, [selectedDate]);

  function openDrawer(student: Student) {
    setDrawerStudent(student);
    const found = savedMenus.find(m => m.student.name === student.name && m.student.class === student.class);
    setSelectedMenu(found ? found.menu : []);
  }
  function closeDrawer() {
    setDrawerStudent(null);
    setSelectedMenu([]);
  }
  function handleMenuToggle(item: string) {
    setSelectedMenu(menu => menu.includes(item) ? menu.filter(i => i !== item) : [...menu, item]);
  }
  function handleSave(payment?: PaymentType) {
    if (!drawerStudent) return;
    const newMenus = savedMenus.filter(m => !(m.student.name === drawerStudent.name && m.student.class === drawerStudent.class));
    newMenus.push({ student: drawerStudent, menu: selectedMenu, date: selectedDate, payment });
    setSavedMenus(selectedDate, newMenus);
    setSavedMenusState(newMenus);
    closeDrawer();
  }
  // Color logic
  function getStudentColor(student: Student) {
    const found = savedMenus.find(m => m.student.name === student.name && m.student.class === student.class);
    if (found?.payment) return 'green';
    if (found) return 'blue';
    return undefined;
  }

  return (
    <div style={{ padding: 8, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, margin: '12px 0' }}>Satış</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
        style={{ marginBottom: 12, width: '100%', fontSize: 18, padding: 8 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        {[ '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf' ].map(cls => (
          <button
            key={cls}
            style={{
              background: selectedClass === cls ? '#1976d2' : '#eee',
              color: selectedClass === cls ? 'white' : '#222',
              width: '100%',
              fontSize: 22,
              fontWeight: 600,
              padding: '22px 0',
              border: 'none',
              borderRadius: 8,
              letterSpacing: 1
            }}
            onClick={() => setSelectedClass(cls as any)}
          >
            {cls}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {students.filter(s => s.class === selectedClass).map(student => (
          <li key={student.name} style={{ marginBottom: 8 }}>
            <button
              style={{
                width: '100%',
                background: getStudentColor(student) || '#2196f3',
                color: 'white',
                padding: 16,
                fontSize: 18,
                border: 'none',
                borderRadius: 8,
                marginBottom: 2
              }}
              onClick={() => openDrawer(student)}
            >
              {student.name}
            </button>
          </li>
        ))}
      </ul>
      {drawerStudent && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0
        }}>
          <div style={{
            background: 'white',
            padding: 16,
            borderRadius: 12,
            minWidth: 0,
            width: '90vw',
            maxWidth: 400,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', alignItems: 'stretch'
          }}>
            <h3 style={{ fontSize: 20, margin: '8px 0 16px 0', textAlign: 'center' }}>{drawerStudent.name} - {drawerStudent.class}</h3>
            <div style={{ marginBottom: 16 }}>
              {menuItems.map(item => (
                <label key={item.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: 17 }}>
                  <input
                    type="checkbox"
                    checked={selectedMenu.includes(item.name)}
                    onChange={() => handleMenuToggle(item.name)}
                    style={{ width: 22, height: 22, marginRight: 10 }}
                  />
                  {item.name} <span style={{ marginLeft: 6, color: '#888', fontSize: 15 }}>({item.price}₺)</span>
                </label>
              ))}
            </div>
            <div style={{ marginBottom: 16, fontSize: 18, textAlign: 'center' }}>
              Toplam: <b>{selectedMenu.reduce((sum, name) => sum + (menuItems.find(i => i.name === name)?.price || 0), 0)}₺</b>
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button style={{ background: '#43a047', fontSize: 18, padding: 14 }} onClick={() => handleSave()}>Kaydet</button>
              <button style={{ background: '#fbc02d', color: '#222', fontSize: 18, padding: 14 }} onClick={() => handleSave('nakit')}>Nakit</button>
              <button style={{ background: '#1976d2', fontSize: 18, padding: 14 }} onClick={() => handleSave('kredi')}>Kredi Kartı</button>
              <button style={{ background: '#e53935', fontSize: 18, padding: 14 }} onClick={closeDrawer}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
