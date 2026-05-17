import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const C = {
    bg: '#f4f5f7',
    card: '#ffffff',
    border: '#e2e8f0',
    accent: '#c4d600',
    text: '#1a1f2e',
    muted: '#475569',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    font: "'Courier New', monospace"
  };

function Attrition({ leavers, allEmployees }) {
  const total = allEmployees.length;
  const rate = ((leavers.length / total) * 100).toFixed(1);
  const avgTenure = leavers.reduce((sum, e) => {
    if (!e['Cont Start Date Confirmed'] || !e['Leave Date']) return sum;
    return sum + (new Date(e['Leave Date']) - new Date(e['Cont Start Date Confirmed'])) / (1000 * 60 * 60 * 24 * 365);
  }, 0) / leavers.length;

  const deptData = Object.entries(groupBy(leavers, 'Discipline')).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  const contractData = Object.entries(groupBy(leavers, 'Employment Type')).map(([name, value]) => ({ name, value }));
  const COLORS = [C.accent, '#1a1f2e', '#94a3b8'];

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, padding: '10px 14px', borderRadius: '2px', fontFamily: C.font }}>
        <p style={{ fontSize: '10px', color: C.accent, letterSpacing: '1px', margin: '0 0 4px', textTransform: 'uppercase' }}>{payload[0].payload.name}</p>
        <p style={{ fontSize: '14px', color: C.text, fontWeight: '700', margin: 0 }}>{payload[0].value} leavers</p>
      </div>
    );
  };

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>Attrition Analysis</h2>
      <div style={S.bar} />
      <div style={S.metrics}>
        <Metric label="Overall Attrition Rate" value={`${rate}%`} sub="of total workforce" alert={parseFloat(rate) > 20} />
        <Metric label="Total Leavers" value={leavers.length} sub="recorded departures" />
        <Metric label="Avg Tenure Before Leaving" value={`${avgTenure.toFixed(1)}y`} sub="years of service" />
      </div>
      <div style={S.charts}>
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Leavers by Department</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: C.muted, fontFamily: C.font }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.text, fontFamily: C.font }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: C.border }} />
              <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                {deptData.map((_, i) => <Cell key={i} fill={i === 0 ? C.accent : C.border} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Leavers by Contract Type</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={contractData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {contractData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ fontSize: '12px', color: C.text, fontFamily: C.font }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, alert }) {
  return (
    <div style={{ ...S.metric, borderTopColor: alert ? C.danger : C.accent }}>
      <div style={{ fontSize: '42px', fontWeight: '800', color: alert ? C.danger : C.text, fontFamily: C.font, marginBottom: '8px', letterSpacing: '-2px' }}>{value}</div>
      <div style={{ fontSize: '11px', color: C.text, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px', fontFamily: C.font }}>{label}</div>
      <div style={{ fontSize: '12px', color: C.muted, fontFamily: C.font }}>{sub}</div>
    </div>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => { const val = item[key] || 'Unknown'; acc[val] = (acc[val] || 0) + 1; return acc; }, {});
}

const S = {
    wrap: { marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #e2e8f0' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: C.text, marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '24px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  metric: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.accent}`, borderRadius: '2px', padding: '28px', textAlign: 'center' },
  charts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  chartCard: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '2px', padding: '24px' },
  chartTitle: { fontSize: '11px', letterSpacing: '2px', color: C.muted, marginBottom: '20px', fontWeight: '600', textTransform: 'uppercase', fontFamily: C.font },
};

export default Attrition;