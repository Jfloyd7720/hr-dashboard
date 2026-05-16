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
function CostAnalysis({ employees }) {
  const active = employees.filter(e => e.Is_Active);
  const byCostCentre = active.reduce((acc, e) => {
    const cc = e['Cost Centre Text'] || 'Unknown';
    if (!acc[cc]) acc[cc] = { count: 0, ftc: 0, contract: 0, permanent: 0, partTime: 0, totalFTE: 0 };
    acc[cc].count++;
    acc[cc].totalFTE += e.FTE || 0;
    if (e['Employment Type'] === 'FTC') acc[cc].ftc++;
    if (e['Employment Type'] === 'Contract') acc[cc].contract++;
    if (e['Employment Type'] === 'Permanent') acc[cc].permanent++;
    if (e.FTE < 1.0) acc[cc].partTime++;
    return acc;
  }, {});

  const sorted = Object.entries(byCostCentre).sort((a, b) => b[1].count - a[1].count);

  const riskColor = (s) => s === 'HIGH' ? C.danger : s === 'MEDIUM' ? C.warning : C.success;
  const riskBg = (s) => s === 'HIGH' ? '#ef444415' : s === 'MEDIUM' ? '#f59e0b15' : '#22c55e15';

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>Cost Centre & People Cost Allocation</h2>
      <div style={S.bar} />
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr style={{ backgroundColor: C.bg }}>
              {['Cost Centre', 'Headcount', 'Total FTE', 'Permanent', 'FTC', 'Contract', 'Part Time', 'Variable Cost Risk'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(([cc, data]) => {
              const variableRatio = ((data.ftc + data.contract) / data.count * 100).toFixed(0);
              const risk = variableRatio > 60 ? 'HIGH' : variableRatio > 30 ? 'MEDIUM' : 'LOW';
              return (
                <tr key={cc} style={S.tr}>
                  <td style={{ ...S.td, fontWeight: '700', color: C.text }}>{cc}</td>
                  <td style={S.td}>{data.count}</td>
                  <td style={S.td}>{data.totalFTE.toFixed(1)}</td>
                  <td style={S.td}>{data.permanent}</td>
                  <td style={S.td}>{data.ftc}</td>
                  <td style={S.td}>{data.contract}</td>
                  <td style={S.td}>{data.partTime}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '2px', color: riskColor(risk), backgroundColor: riskBg(risk), fontFamily: C.font, letterSpacing: '1px' }}>
                      {risk} ({variableRatio}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const S = {
  wrap: { marginBottom: '56px' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: C.text, marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '24px' },
  tableWrap: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '2px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: C.font },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', color: C.muted, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', fontWeight: '600', textTransform: 'uppercase' },
  tr: { borderBottom: `1px solid ${C.border}` },
  td: { padding: '14px 16px', color: C.muted, whiteSpace: 'nowrap' }
};

export default CostAnalysis;