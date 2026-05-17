import { useState } from "react";

const C = { bg: '#f4f5f7', card: '#ffffff', border: '#e2e8f0', accent: '#c4d600', text: '#1a1f2e', muted: '#475569', warning: '#f59e0b', font: "'Courier New', monospace" };

function FTCAlerts({ alerts }) {
  const [hovered, setHovered] = useState(null);
  if (!alerts.length) return null;

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>FTC Contracts Expiring Within 90 Days</h2>
      <div style={S.bar} />
      <div style={S.grid}>
        {alerts.map((e, i) => (
          <div
            key={e.UniqueID}
            style={{
              ...S.card,
              transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hovered === i ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'all .2s ease'
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={S.name}>{e['Known As']} {e.Surname}</div>
            <div style={S.detail}>{e['Job Title']}</div>
            <div style={S.detail}>{e.Office} · {e['Business Unit']}</div>
            <div style={S.days}>{Math.round(e.Days_Until_FTC_Expiry)} days remaining</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  wrap: { marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #e2e8f0' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1f2e', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' },
  card: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.warning}`, borderRadius: '2px', padding: '20px', cursor: 'default' },
  name: { fontWeight: '700', fontSize: '14px', color: C.text, marginBottom: '6px', fontFamily: C.font },
  detail: { fontSize: '12px', color: C.muted, marginBottom: '3px', fontFamily: C.font },
  days: { fontSize: '13px', color: C.warning, marginTop: '12px', fontWeight: '700', fontFamily: C.font }
};

export default FTCAlerts;