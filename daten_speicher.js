// daten_speicher.js
// Modul für lokale Speicherung, Passwort-Hashing und Export/Import
// Lädt automatisch im globalen scope: window.DS (DatenSpeicher)

const DS = (function () {
  const KEY = 'delivzone_accounts_v1';

  // SHA-256 Hash (ArrayBuffer -> hex)
  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function _loadRaw() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('DS: load error', e);
      return [];
    }
  }

  function _saveRaw(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  async function saveAccount(accountObj, options = { remember: true }) {
    // accountObj must contain: type ('privat'|'unternehmen'), and fields depending on type.
    // Hash the provided password field(s) before storing.
    const data = _loadRaw();
    const timestamp = Date.now();
    const record = { id: 'acc_' + timestamp, createdAt: timestamp, type: accountObj.type, meta: {} };

    if (accountObj.type === 'privat') {
      if (!accountObj.password) throw new Error('Passwort fehlt');
      const passHash = await hashPassword(accountObj.password);
      record.meta = {
        name: accountObj.name || '',
        dob: accountObj.dob || '',
        email: accountObj.email || '',
        passwordHash: passHash
      };
    } else {
      if (!accountObj.company_password) throw new Error('Passwort fehlt');
      const passHash = await hashPassword(accountObj.company_password);
      record.meta = {
        company_name: accountObj.company_name || '',
        company_url: accountObj.company_url || '',
        company_email: accountObj.company_email || '',
        company_license: accountObj.company_license || '',
        passwordHash: passHash
      };
    }

    if (options.remember !== false) {
      data.push(record);
      _saveRaw(data);
    }
    return record;
  }

  function getAccounts() {
    return _loadRaw();
  }

  function clearAll() {
    localStorage.removeItem(KEY);
  }

  function exportJSON() {
    const data = _loadRaw();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    return { url, filename: 'delivzone_data_export.json' };
  }

  async function importJSONFile(file) {
    // file: File object
    const text = await file.text();
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error('Ungültiges Format');
      // Overwrite local data (you can change merging logic)
      _saveRaw(arr);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  return {
    saveAccount,
    getAccounts,
    clearAll,
    exportJSON,
    importJSONFile
  };
})();

// expose
window.DS = DS;
