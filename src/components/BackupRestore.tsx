import React from 'react';

// Backup all localStorage keys that start with 'savedMenus-'
function getAllMenuData() {
  const data: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('savedMenus-')) {
      data[key] = localStorage.getItem(key);
    }
  }
  return data;
}

function restoreMenuData(data: Record<string, any>) {
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('savedMenus-')) {
      localStorage.setItem(key, value as string);
    }
  });
}

export default function BackupRestore() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleBackup() {
    const data = getAllMenuData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunch-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        restoreMenuData(data);
        alert('Kayıtlar başarıyla yüklendi!');
      } catch {
        alert('Geçersiz dosya!');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexDirection: 'column' }}>
      <button onClick={handleBackup} style={{ background: '#1976d2', color: 'white', fontSize: 16, padding: 10 }}>Yedekle (İndir)</button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleRestore}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{ background: '#43a047', color: 'white', fontSize: 16, padding: 10 }}
      >
        Geri Yükle (Dosyadan)
      </button>
    </div>
  );
}
