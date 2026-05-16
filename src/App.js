import { useState, useEffect } from "react";
import Headcount from "./components/Headcount";
import Attrition from "./components/Attrition";
import FTCAlerts from "./components/FTCAlerts";
import CostAnalysis from "./components/CostAnalysis";
import DataQuality from "./components/DataQuality";
import FTCTimeline from "./components/FTCTimeline";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
};

function BuroLogo({ light = false }) {
  return (
    <div style={logo.wrap}>
      <div style={{ ...logo.line, backgroundColor: '#c4d600' }} />
      <div style={{ ...logo.text, color: light ? '#ffffff' : '#1a1a1a' }}>BURO HAPPOLD</div>
      <div style={{ ...logo.line, backgroundColor: '#c4d600' }} />
    </div>
  );
}

const logo = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '5px' },
  line: { height: '3px', width: '100%' },
  text: { fontSize: '20px', fontWeight: '800', letterSpacing: '4px', fontFamily: 'Arial, sans-serif' },
};

// ── Login ──────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === 'burohappold2026') {
      sessionStorage.setItem('bh_auth', 'true');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={loginStyles.page}>
      <div style={loginStyles.card}>
        <BuroLogo />
        <div style={loginStyles.divider} />
        <p style={loginStyles.subtitle}>People Analytics Dashboard</p>
        <p style={loginStyles.notice}>🔒 Restricted access — authorised personnel only</p>
        <input
          type="password"
          placeholder="Enter access code"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ ...loginStyles.input, borderColor: error ? '#c0392b' : '#e5e5e5' }}
        />
        {error && <p style={loginStyles.error}>Incorrect access code</p>}
        <button onClick={handleSubmit} style={loginStyles.btn}>
          Access Dashboard →
        </button>
        <p style={loginStyles.footer}>
          In production: Supabase Row Level Security with role-based access control.
          Line managers see their team only. HR sees all.
        </p>
      </div>
    </div>
  );
}

const loginStyles = {
  page: { minHeight: '100vh', backgroundColor: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '4px', padding: '48px', width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  divider: { height: '1px', backgroundColor: '#e5e5e5', margin: '24px 0' },
  subtitle: { fontSize: '13px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 24px' },
  notice: { fontSize: '12px', color: '#666', backgroundColor: '#f8f8f6', padding: '10px 14px', borderRadius: '2px', border: '1px solid #e5e5e5', marginBottom: '24px' },
  input: { width: '100%', padding: '12px 16px', fontSize: '14px', border: '1px solid #e5e5e5', borderRadius: '2px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', marginBottom: '8px' },
  error: { fontSize: '12px', color: '#c0392b', margin: '0 0 8px' },
  btn: { width: '100%', padding: '14px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', borderRadius: '2px', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '8px', fontFamily: 'Arial, sans-serif' },
  footer: { fontSize: '11px', color: '#999', marginTop: '24px', lineHeight: '1.6', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }
};

// ── Main App ───────────────────────────────────────────────────────────────

function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('bh_auth') === 'true');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    const fetchData = async () => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/employees_clean?select=*`,
        { headers }
      );
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchData();
  }, [authed]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  if (loading) return <div style={styles.loading}>Loading HR data...</div>;

  const active = employees.filter(e => e.Is_Active);
  const leavers = employees.filter(e => !e.Is_Active);
  const ftcAlerts = employees.filter(e => e.FTC_Expiring_Soon);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <BuroLogo />
        <div style={styles.stats}>
          <Stat label="Active Employees" value={active.length} />
          <Stat label="Total Leavers" value={leavers.length} />
          <Stat label="FTC Expiring" value={ftcAlerts.length} highlight={ftcAlerts.length > 0} />
          <button onClick={() => { sessionStorage.removeItem('bh_auth'); setAuthed(false); }} style={styles.logout}>
            Log out
          </button>
        </div>
      </header>
      <div style={styles.body}>
        <DataQuality employees={employees} />
        <FTCAlerts alerts={ftcAlerts} />
        <FTCTimeline employees={employees} />
        <Headcount employees={active} />
        <Attrition leavers={leavers} allEmployees={employees} />
        <CostAnalysis employees={employees} />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ ...styles.stat, borderColor: highlight ? '#c4d600' : '#e5e5e5' }}>
      <div style={{ ...styles.statNum, color: highlight ? '#c4d600' : '#1a1a1a' }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles = {
  app: { backgroundColor: '#f8f8f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: '#1a1a1a' },
  loading: { backgroundColor: '#f8f8f6', color: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', fontSize: '14px', letterSpacing: '2px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  stats: { display: 'flex', gap: '16px', alignItems: 'center' },
  stat: { textAlign: 'center', padding: '12px 24px', backgroundColor: '#f8f8f6', border: '1px solid #e5e5e5', borderRadius: '2px', minWidth: '100px' },
  statNum: { fontSize: '28px', fontWeight: '700' },
  statLabel: { fontSize: '10px', color: '#666', letterSpacing: '1px', marginTop: '4px', textTransform: 'uppercase' },
  body: { padding: '36px 48px' },
  logout: { padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #e5e5e5', borderRadius: '2px', fontSize: '12px', color: '#666', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'Arial, sans-serif' }
};

export default App;