import { useState, useEffect } from "react";
import Headcount from "./components/Headcount";
import Attrition from "./components/Attrition";
import FTCAlerts from "./components/FTCAlerts";
import CostAnalysis from "./components/CostAnalysis";
import DataQuality from "./components/DataQuality";
import FTCTimeline from "./components/FTCTimeline";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

const FONT = "'Courier New', monospace";
const ACCENT = '#c4d600';
const DARK = '#1a1f2e';

function BuroLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ height: '2px', backgroundColor: ACCENT }} />
      <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '5px', color: '#ffffff', fontFamily: FONT }}>
        BURO HAPPOLD
      </div>
      <div style={{ height: '2px', backgroundColor: ACCENT }} />
    </div>
  );
}

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderTop: `3px solid ${ACCENT}`, borderRadius: '4px', padding: '48px', width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '28px' }}>
          <div style={{ height: '2px', backgroundColor: ACCENT }} />
          <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '5px', color: DARK, fontFamily: FONT }}>BURO HAPPOLD</div>
          <div style={{ height: '2px', backgroundColor: ACCENT }} />
        </div>
        <div style={{ height: '1px', backgroundColor: '#e2e8f0', marginBottom: '28px' }} />
        <p style={{ fontSize: '11px', color: '#64748b', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 24px', fontFamily: FONT }}>People Analytics Dashboard</p>
        <p style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f4f5f7', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '2px', marginBottom: '24px', fontFamily: FONT }}>
          🔒 Restricted access — authorised personnel only
        </p>
        <input
          type="password"
          placeholder="Enter access code"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: '100%', padding: '12px 16px', fontSize: '13px', backgroundColor: '#f4f5f7', border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`, borderRadius: '2px', outline: 'none', boxSizing: 'border-box', fontFamily: FONT, color: DARK, marginBottom: '8px' }}
        />
        {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '0 0 8px', fontFamily: FONT }}>Incorrect access code</p>}
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '14px', backgroundColor: DARK, color: '#ffffff', border: 'none', borderRadius: '2px', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', cursor: 'pointer', fontFamily: FONT, marginTop: '8px' }}
        >
          ACCESS DASHBOARD →
        </button>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '24px', lineHeight: '1.8', borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontFamily: FONT }}>
          Production: Supabase Row Level Security with role-based access. Line managers see their team only.
        </p>
      </div>
    </div>
  );
}

function DataFreshness({ employees }) {
  if (!employees.length) return null;
  const latest = new Date(employees[0].ingested_at);
  const now = new Date();
  const diffMins = Math.round((now - latest) / (1000 * 60));
  const diffHours = Math.round(diffMins / 60);
  const freshLabel = diffMins < 60 ? `${diffMins} minutes ago` : diffHours < 24 ? `${diffHours} hours ago` : `${Math.round(diffHours / 24)} days ago`;
  const isStale = diffHours > 24;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 48px', backgroundColor: '#f4f5f7', borderBottom: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', fontFamily: FONT }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isStale ? '#ef4444' : '#22c55e', boxShadow: `0 0 8px ${isStale ? '#ef4444' : '#22c55e'}`, flexShrink: 0 }} />
      <span>Pipeline last ran: <strong style={{ color: DARK }}>{freshLabel}</strong> &nbsp;·&nbsp; {employees.length} records loaded{isStale && <span style={{ color: '#ef4444' }}> — data may be stale</span>}</span>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 28px', backgroundColor: 'rgba(255,255,255,0.08)', border: `1px solid ${highlight ? ACCENT : 'rgba(255,255,255,0.15)'}`, borderRadius: '2px', minWidth: '100px' }}>
      <div style={{ fontSize: '30px', fontWeight: '800', color: highlight ? ACCENT : '#ffffff', fontFamily: FONT }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase', fontFamily: FONT }}>{label}</div>
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('bh_auth') === 'true');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    const fetchData = async () => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/employees_clean?select=*`, { headers });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchData();
  }, [authed]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  if (loading) return (
    <div style={{ backgroundColor: '#f4f5f7', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#64748b', letterSpacing: '3px', fontSize: '12px' }}>
      LOADING HR DATA...
    </div>
  );

  const active = employees.filter(e => e.Is_Active);
  const leavers = employees.filter(e => !e.Is_Active);
  const ftcAlerts = employees.filter(e => e.FTC_Expiring_Soon);

  return (
    <div style={{ backgroundColor: '#f4f5f7', minHeight: '100vh', fontFamily: FONT, color: DARK }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px', backgroundColor: DARK, borderBottom: `3px solid ${ACCENT}` }}>
        <BuroLogo />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Stat label="Active Employees" value={active.length} />
          <Stat label="Total Leavers" value={leavers.length} />
          <Stat label="FTC Expiring" value={ftcAlerts.length} highlight={ftcAlerts.length > 0} />
          <button
            onClick={() => { sessionStorage.removeItem('bh_auth'); setAuthed(false); }}
            style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '2px', fontFamily: FONT }}
          >
            LOG OUT
          </button>
        </div>
      </header>
      <DataFreshness employees={employees} />
      <div style={{ padding: '40px 48px' }}>
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

export default App;