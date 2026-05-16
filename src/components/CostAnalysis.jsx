function CostAnalysis({ employees }) {
    const active = employees.filter(e => e.Is_Active);
  
    // Group by cost centre text
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
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>COST CENTRE & PEOPLE COST ALLOCATION</h2>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Cost Centre', 'Headcount', 'Total FTE', 'Permanent', 'FTC', 'Contract', 'Part Time', 'Variable Cost Risk'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(([cc, data]) => {
                const variableRatio = ((data.ftc + data.contract) / data.count * 100).toFixed(0);
                const risk = variableRatio > 60 ? 'HIGH' : variableRatio > 30 ? 'MEDIUM' : 'LOW';
                const riskColor = risk === 'HIGH' ? '#ef4444' : risk === 'MEDIUM' ? '#f59e0b' : '#10b981';
                return (
                  <tr key={cc} style={styles.tr}>
                    <td style={styles.td}>{cc}</td>
                    <td style={styles.td}>{data.count}</td>
                    <td style={styles.td}>{data.totalFTE.toFixed(1)}</td>
                    <td style={styles.td}>{data.permanent}</td>
                    <td style={styles.td}>{data.ftc}</td>
                    <td style={styles.td}>{data.contract}</td>
                    <td style={styles.td}>{data.partTime}</td>
                    <td style={{ ...styles.td, color: riskColor, fontWeight: '600' }}>{risk} ({variableRatio}%)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  const styles = {
    wrap: { marginBottom: '48px' },
    heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1a1a', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' },
    headingBar: { height: '3px', backgroundColor: '#c4d600', width: '48px', marginBottom: '20px' },
    tableWrap: { overflowX: 'auto', backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '2px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', color: '#666', borderBottom: '2px solid #e5e5e5', whiteSpace: 'nowrap', fontWeight: '600', textTransform: 'uppercase', backgroundColor: '#f8f8f6' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '14px 16px', color: '#1a1a1a', whiteSpace: 'nowrap' }
  };
  
  export default CostAnalysis;