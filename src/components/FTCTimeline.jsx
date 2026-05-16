import { useState } from "react";

function FTCTimeline({ employees }) {
    const today = new Date();
    
    // Build next 12 months
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleString('en-GB', { month: 'short', year: 'numeric' }),
        count: 0,
        employees: []
      };
    });
  
    // Count FTC expiries per month
    employees.forEach(e => {
      if (e['Employment Type'] !== 'FTC' || !e['FTC End Date'] || !e.Is_Active) return;
      const expiry = new Date(e['FTC End Date']);
      const key = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find(m => m.key === key);
      if (month) {
        month.count++;
        month.employees.push(`${e['Known As']} ${e.Surname}`);
      }
    });
  
    const max = Math.max(...months.map(m => m.count), 1);
    const [hovered, setHovered] = useState(null);
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>FTC Contract Expiry Timeline</h2>
        <div style={styles.headingBar} />
        <p style={styles.desc}>Active FTC contracts expiring over the next 12 months — forward planning view for HR and resourcing teams.</p>
        
        <div style={styles.chart}>
          {months.map((month, i) => (
            <div 
              key={month.key} 
              style={styles.col}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.barWrap}>
                {month.count > 0 && (
                  <div style={styles.countLabel}>{month.count}</div>
                )}
                <div style={{
                  ...styles.bar,
                  height: `${(month.count / max) * 180}px`,
                  backgroundColor: month.count === 0 ? '#f0f0f0' : i === 0 ? '#c0392b' : '#c4d600',
                  opacity: hovered !== null && hovered !== i ? 0.4 : 1
                }} />
              </div>
              {hovered === i && month.employees.length > 0 && (
                <div style={styles.tooltip}>
                  <div style={styles.tooltipTitle}>{month.label}</div>
                  {month.employees.map(name => (
                    <div key={name} style={styles.tooltipName}>{name}</div>
                  ))}
                </div>
              )}
              <div style={styles.monthLabel}>{month.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const styles = {
    wrap: { marginBottom: '48px' },
    heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1a1a', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' },
    headingBar: { height: '3px', backgroundColor: '#c4d600', width: '48px', marginBottom: '16px' },
    desc: { fontSize: '13px', color: '#666', marginBottom: '32px', lineHeight: '1.6' },
    chart: { display: 'flex', alignItems: 'flex-end', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '2px', padding: '32px 24px 16px', position: 'relative' },
    col: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'default' },
    barWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '200px' },
    bar: { width: '100%', minHeight: '4px', borderRadius: '2px 2px 0 0', transition: 'opacity .2s' },
    countLabel: { fontSize: '12px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
    monthLabel: { fontSize: '10px', color: '#666', marginTop: '8px', textAlign: 'center', letterSpacing: '0.5px' },
    tooltip: { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1a1a1a', color: '#fff', padding: '10px 14px', borderRadius: '4px', zIndex: 10, minWidth: '140px', marginBottom: '8px', pointerEvents: 'none' },
    tooltipTitle: { fontSize: '11px', fontWeight: '700', marginBottom: '6px', color: '#c4d600', letterSpacing: '1px' },
    tooltipName: { fontSize: '12px', color: '#e5e5e5', marginBottom: '3px' }
  };
  
  export default FTCTimeline;