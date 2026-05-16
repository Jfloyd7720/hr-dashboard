import { useState } from "react";
const C = {
    bg: '#f4f5f7',
    card: '#ffffff',
    border: '#e2e8f0',
    accent: '#c4d600',
    text: '#1a1f2e',
    muted: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    font: "'Courier New', monospace"
  };

function FTCTimeline({ employees }) {
  const today = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('en-GB', { month: 'short', year: 'numeric' }), count: 0, employees: [] };
  });

  employees.forEach(e => {
    if (e['Employment Type'] !== 'FTC' || !e['FTC End Date'] || !e.Is_Active) return;
    const expiry = new Date(e['FTC End Date']);
    const key = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find(m => m.key === key);
    if (month) { month.count++; month.employees.push(`${e['Known As']} ${e.Surname}`); }
  });

  const max = Math.max(...months.map(m => m.count), 1);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>FTC Contract Expiry Timeline</h2>
      <div style={S.bar} />
      <p style={S.desc}>Active FTC contracts expiring over the next 12 months — forward planning view for HR and resourcing teams.</p>
      <div style={S.chart}>
        {months.map((month, i) => (
          <div key={month.key} style={S.col} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={S.barWrap}>
              {month.count > 0 && <div style={{ ...S.countLbl, color: C.text }}>{month.count}</div>}
              <div style={{ ...S.barEl, height: `${(month.count / max) * 160}px`, backgroundColor: month.count === 0 ? C.border : i === 0 ? C.danger : C.accent, opacity: hovered !== null && hovered !== i ? 0.3 : 1 }} />
            </div>
            {hovered === i && month.employees.length > 0 && (
              <div style={S.tooltip}>
                <div style={{ fontSize: '10px', color: C.accent, letterSpacing: '1px', marginBottom: '6px', fontWeight: '700' }}>{month.label}</div>
                {month.employees.map(n => <div key={n} style={{ fontSize: '12px', color: C.text, marginBottom: '3px' }}>{n}</div>)}
              </div>
            )}
            <div style={S.monthLbl}>{month.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  wrap: { marginBottom: '56px' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: C.text, marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '16px' },
  desc: { fontSize: '13px', color: C.muted, marginBottom: '28px', lineHeight: '1.6', fontFamily: C.font },
  chart: { display: 'flex', alignItems: 'flex-end', gap: '8px', backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '2px', padding: '32px 24px 16px', position: 'relative' },
  col: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'default' },
  barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '180px' },
  barEl: { width: '100%', minHeight: '4px', borderRadius: '2px 2px 0 0', transition: 'opacity .2s' },
  countLbl: { fontSize: '12px', fontWeight: '700', marginBottom: '4px', fontFamily: C.font },
  monthLbl: { fontSize: '10px', color: C.muted, marginTop: '8px', textAlign: 'center', fontFamily: C.font },
  tooltip: { position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)', backgroundColor: C.card, border: `1px solid ${C.border}`, padding: '12px 16px', borderRadius: '4px', zIndex: 10, minWidth: '150px', pointerEvents: 'none' }
};

export default FTCTimeline;