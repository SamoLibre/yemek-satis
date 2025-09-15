import React from 'react';
import { useSelectedDate } from '../context/SelectedDateContext';
import { students } from '../data/students';
import { menuItems } from '../data/menuItems';
import { getDateKey } from '../utils/dateKey';
import type { SavedMenu } from './Sales';

function getSavedMenus(date: string): SavedMenu[] {
  const key = `savedMenus-${getDateKey(date)}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export default function Account() {
  const { selectedDate } = useSelectedDate();
  const [savedMenus, setSavedMenus] = React.useState<SavedMenu[]>(() => getSavedMenus(selectedDate));

  React.useEffect(() => {
    setSavedMenus(getSavedMenus(selectedDate));
  }, [selectedDate]);

  const totals = savedMenus.reduce(
    (acc, m) => {
      const total = m.menu.reduce((sum, name) => sum + (menuItems.find(i => i.name === name)?.price || 0), 0);
      if (m.payment === 'nakit') acc.nakit += total;
      else if (m.payment === 'kredi') acc.kredi += total;
      else acc.unpaid += total;
      acc.toplam += total;
      return acc;
    },
    { nakit: 0, kredi: 0, unpaid: 0, toplam: 0 }
  );

  // Per-student totals
  const studentTotals = students.map(student => {
    const menu = savedMenus.find(m => m.student.name === student.name && m.student.class === student.class);
    const total = menu ? menu.menu.reduce((sum, name) => sum + (menuItems.find(i => i.name === name)?.price || 0), 0) : 0;
    return { ...student, total, payment: menu?.payment };
  });

  // Per-item counts (optional)
  const itemCounts: Record<string, number> = {};
  menuItems.forEach(item => {
    itemCounts[item.name] = savedMenus.reduce((sum, m) => sum + (m.menu.includes(item.name) ? 1 : 0), 0);
  });

  return (
    <div style={{ padding: 8, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, margin: '12px 0' }}>Hesap</h2>
      <div style={{ marginBottom: 10, fontSize: 16 }}>
        <b>Tarih:</b> <span style={{ fontWeight: 400 }}>{selectedDate}</span>
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, fontSize: 17,
        background: '#f5f5f5', borderRadius: 8, padding: 10, justifyContent: 'center'
      }}>
        <span style={{ color: '#43a047' }}><b>Nakit:</b> {totals.nakit}₺</span>
        <span style={{ color: '#1976d2' }}><b>Kredi:</b> {totals.kredi}₺</span>
        <span style={{ color: '#222' }}><b>Toplam:</b> {totals.toplam}₺</span>
      </div>
      <div style={{ marginBottom: 14, fontSize: 16 }}>
        <b>Ödenmemiş Kayıtlar:</b> <span style={{ color: '#e53935' }}>{totals.unpaid}₺</span>
        <ul style={{ margin: 6, paddingLeft: 18 }}>
          {savedMenus.filter(m => !m.payment).map(m => (
            <li key={m.student.name + m.student.class}>
              <span style={{ fontWeight: 500 }}>{m.student.name}</span> <span style={{ color: '#888' }}>({m.student.class})</span>: <span style={{ color: '#555' }}>{m.menu.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 14, fontSize: 16 }}>
        <b>Öğrenci Bazında Toplamlar:</b>
        <ul style={{ margin: 6, paddingLeft: 18 }}>
          {studentTotals.filter(s => s.total > 0).map(s => (
            <li key={s.name + s.class}>
              <span style={{ fontWeight: 500 }}>{s.name}</span> <span style={{ color: '#888' }}>({s.class})</span>: <span style={{ color: '#222' }}>{s.total}₺</span> {s.payment ? <span style={{ color: s.payment === 'nakit' ? '#43a047' : '#1976d2' }}>({s.payment === 'nakit' ? 'Nakit' : 'Kredi'})</span> : ''}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 14, fontSize: 16 }}>
        <b>Menü Bazında Adetler:</b>
        <ul style={{ margin: 6, paddingLeft: 18 }}>
          {menuItems.map(item => (
            <li key={item.name}>
              <span style={{ fontWeight: 500 }}>{item.name}</span>: <span style={{ color: '#222' }}>{itemCounts[item.name]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
