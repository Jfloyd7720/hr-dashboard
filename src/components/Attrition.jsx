function Attrition({ leavers, allEmployees }) {
    const byDept = groupBy(leavers, 'Discipline');
    const byContract = groupBy(leavers, 'Employment Type');
    const total = allEmployees.length;
    const rate = ((leavers.length / total) * 100).toFixed(1);
  
    const avgTenure = leavers.reduce((sum, e) => {
      if (!e['Cont Start Date Confirmed'] || !e['Leave Date']) return sum;
      const start = new Date(e['Cont Start Date Confirmed']);
      const end = new Date(e['Leave Date']);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return sum + years;
    }, 0) / leavers.length;
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>ATTRITION ANALYSIS</h2>
        <div style={styles.topRow}>
          <div style={styles.metric}>
            <div style={styles.metricNum}>{rate}%</div>
            <div style={styles.metricLabel}>Overall Attrition Rate</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricNum}>{leavers.length}</div>
            <div style={styles.metricLabel}>Total Leavers</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricNum}>{avgTenure.toFixed(1)}y</div>
            <div style={styles.metricLabel}>Avg Tenure Before Leaving</div>
          </div>
        </div>
        <div style={styles.grid}>
          <MiniCard title="Leavers by Department" data={byDept} />
          <MiniCard title="Leavers by Contract Type" data={byContract} />
        </div>
      </div>
    );
  }
  
  function MiniCard({ title, data }) {
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    return (
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title}</div>
        {sorted.map(([key, count]) => (
          <div key={key} style={styles.row}>
            <span style={styles.label}>{key}</span>
            <span style={styles.count}>{count}</span>
          </div>
        ))}
      </div>
    );
  }
  
  function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
      const val = item[key] || 'Unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  }
  
  const styles = {
    wrap: { marginBottom: '48px' },
    heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1a1a', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' },
    headingBar: { height: '3px', backgroundColor: '#c4d600', width: '48px', marginBottom: '20px' },
    topRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
    metric: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderTop: '3px solid #c4d600', borderRadius: '2px', padding: '24px', flex: 1, textAlign: 'center' },
    metricNum: { fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' },
    metricLabel: { fontSize: '10px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '2px', padding: '24px' },
    cardTitle: { fontSize: '11px', letterSpacing: '2px', color: '#666', marginBottom: '16px', fontWeight: '600', textTransform: 'uppercase' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' },
    label: { fontSize: '13px', color: '#1a1a1a' },
    count: { fontSize: '13px', color: '#1a1a1a', fontWeight: '600' }
  };
  
  export default Attrition;