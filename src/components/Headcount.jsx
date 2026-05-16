function Headcount({ employees }) {
    const byOffice = groupBy(employees, 'Office');
    const byContract = groupBy(employees, 'Employment Type');
    const byBU = groupBy(employees, 'Business Unit');
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>HEADCOUNT BREAKDOWN</h2>
        <div style={styles.headingBar} />
        <div style={styles.grid}>
          <Card title="By Office" data={byOffice} />
          <Card title="By Contract Type" data={byContract} />
          <Card title="By Business Unit" data={byBU} />
        </div>
      </div>
    );
  }
  
  function Card({ title, data }) {
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;
  
    return (
      <div style={styles.card}>
        <div style={styles.cardTitle}>{title}</div>
        {sorted.map(([key, count]) => (
          <div key={key} style={styles.row}>
            <div style={styles.label}>{key}</div>
            <div style={styles.barWrap}>
              <div style={{ ...styles.bar, width: `${(count / max) * 100}%` }} />
            </div>
            <div style={styles.count}>{count}</div>
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '2px', padding: '24px' },
    cardTitle: { fontSize: '11px', letterSpacing: '2px', color: '#666', marginBottom: '20px', fontWeight: '600', textTransform: 'uppercase' },
    row: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    label: { fontSize: '12px', color: '#1a1a1a', width: '110px', flexShrink: 0 },
    barWrap: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: '1px', height: '6px' },
    bar: { height: '6px', backgroundColor: '#c4d600', borderRadius: '1px' },
    count: { fontSize: '12px', color: '#1a1a1a', fontWeight: '600', width: '30px', textAlign: 'right' }
  };
  
  export default Headcount;