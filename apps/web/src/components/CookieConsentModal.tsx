import React, { useState } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

const CookieConsentModal = () => {
  const { consent, updateConsent, modalOpen, closeModal, t } = useCookieConsent();
  const [draft, setDraft] = useState(consent);

  React.useEffect(() => {
    setDraft(consent);
  }, [modalOpen]);

  if (!modalOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 400, width: '100%', padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>{t.modalTitle}</h2>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, opacity: 0.6 }}>
            <input type="checkbox" checked disabled style={{ marginRight: 8 }} />
            <span>{t.required}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <input type="checkbox" id="tawk" checked={draft.tawk} onChange={e => setDraft(d => ({ ...d, tawk: e.target.checked }))} style={{ marginRight: 8 }} />
            <label htmlFor="tawk">{t.tawk}</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <input type="checkbox" id="analytics" checked={draft.analytics} onChange={e => setDraft(d => ({ ...d, analytics: e.target.checked }))} style={{ marginRight: 8 }} />
            <label htmlFor="analytics">{t.analytics}</label>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { updateConsent(draft); closeModal(); }}>{t.save}</button>
          <button style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={closeModal}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal; 