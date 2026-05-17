import { useInView } from '../hooks/useInView';

const C = { bg: '#f4f5f7', card: '#ffffff', border: '#e2e8f0', accent: '#c4d600', text: '#1a1f2e', muted: '#475569', font: "'Courier New', monospace" };

function Headcount({ employees }) {
  const byOffice = groupBy(employees, 'Office');
  const byContract = groupBy(employees, 'Employment Type');
  const byBU = groupBy(employees, 'Business Unit');

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>Headcount Breakdown</h2>
      <div style={S.bar} />
      <div style={S.grid}>
        <Card title="By Office" data={byOffice} />
        <Card title="By Contract Type" data={byContract} />
        <Card title="By Business Unit" data={byBU} />
      </div>
    </div>
  );
}

function Card({ title, data }) {
  const [ref, inView] = useInView();
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div ref={ref} style={S.card}>
      <div style={S.cardTitle}>{title}</div>
      {sorted.map(([key, count]) => (
        <div key={key} style={S.row}>
          <div style={S.label}>{key}</div>
          <div style={S.barWrap}>
            <div style={{
              ...S.barEl,
              width: inView ? `${(count / max) * 100}%` : '0%',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <div style={S.count}>{count}</div>
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

const S = {
  wrap: { marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #e2e8f0' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1f2e', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  card: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '2px', padding: '24px' },
  cardTitle: { fontSize: '11px', letterSpacing: '2px', color: C.muted, marginBottom: '20px', fontWeight: '600', textTransform: 'uppercase', fontFamily: C.font },
  row: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  label: { fontSize: '12px', color: C.text, width: '110px', flexShrink: 0, fontFamily: C.font },
  barWrap: { flex: 1, backgroundColor: '#d1d5db', borderRadius: '1px', height: '6px', overflow: 'hidden' },
  barEl: { height: '6px', backgroundColor: C.accent, borderRadius: '1px' },
  count: { fontSize: '12px', color: C.text, fontWeight: '700', width: '30px', textAlign: 'right', fontFamily: C.font }
};

export default Headcount;