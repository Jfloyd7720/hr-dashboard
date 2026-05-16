function FTCAlerts({ alerts }) {
    if (!alerts.length) return null;
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>⚠ FTC CONTRACTS EXPIRING WITHIN 90 DAYS</h2>
        <div style={styles.grid}>
          {alerts.map(e => (
            <div key={e.UniqueID} style={styles.card}>
              <div style={styles.name}>{e['Known As']} {e.Surname}</div>
              <div style={styles.detail}>{e.Job_Title || e['Job Title']}</div>
              <div style={styles.detail}>{e.Office} · {e['Business Unit']}</div>
              <div style={styles.days}>
                {Math.round(e.Days_Until_FTC_Expiry)} days remaining
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const styles = {
    wrap: { marginBottom: '48px' },
    heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1a1a', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' },
    headingBar: { height: '3px', backgroundColor: '#c4d600', width: '48px', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderTop: '3px solid #c4d600', borderRadius: '2px', padding: '20px' },
    name: { fontWeight: '700', fontSize: '14px', color: '#1a1a1a', marginBottom: '6px' },
    detail: { fontSize: '12px', color: '#666', marginBottom: '3px' },
    days: { fontSize: '13px', color: '#c4d600', marginTop: '12px', fontWeight: '700' }
  };
  
  export default FTCAlerts;