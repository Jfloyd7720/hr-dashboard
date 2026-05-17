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
function DataQuality({ employees }) {
  const issues = [
    { id: 1, issue: "Inconsistent office names", detail: "LDN and London used interchangeably for the same office", affected: 90, fix: "Standardised all LDN → London", severity: "MEDIUM" },
    { id: 2, issue: "Lowercase first names", detail: "Multiple employees had lowercase 'Known As' values e.g. deborah, mohammed", affected: 12, fix: "Applied title case to all name fields", severity: "LOW" },
    { id: 3, issue: "Invalid grade value", detail: "Grade column contains 'High' — valid values are A–E only", affected: employees.filter(e => !e.Grade_valid).length, fix: "Flagged as Grade_valid = false for investigation", severity: "HIGH" },
    { id: 4, issue: "FTE values exceeding 1.0", detail: "FTE of 1.2 recorded — a single employee cannot exceed 1.0 FTE", affected: employees.filter(e => !e.FTE_valid).length, fix: "Flagged as FTE_valid = false for HR review", severity: "HIGH" },
    { id: 5, issue: "Duplicate email addresses", detail: "3 records share an email address — each employee should have a unique email", affected: employees.filter(e => e.Email_duplicate).length, fix: "Flagged as Email_duplicate = true for investigation", severity: "HIGH" },
    { id: 6, issue: "Dates stored as text", detail: "Start date, leave date and FTC end date stored as strings not datetime", affected: employees.length, fix: "Parsed all date columns to datetime64 with dayfirst=True", severity: "MEDIUM" },
    { id: 7, issue: "Unknown manager placeholder", detail: "'Unknown Manager' used where line manager is not assigned", affected: employees.filter(e => !e.Manager_known).length, fix: "Flagged as Manager_known = false — requires HR data entry", severity: "MEDIUM" },
    { id: 8, issue: "Inconsistent manager name format", detail: "Some managers include titles (Dr, Mr, Miss) others do not", affected: 24, fix: "Stripped titles from Line Manager field using regex", severity: "LOW" },
    { id: 9, issue: "Missing FTC end dates", detail: "Some FTC employees have no FTC End Date recorded", affected: employees.filter(e => e['Employment Type'] === 'FTC' && !e['FTC End Date']).length, fix: "Flagged for HR review — required field for FTC staff", severity: "HIGH" },
  ];

  const high = issues.filter(i => i.severity === 'HIGH').length;
  const medium = issues.filter(i => i.severity === 'MEDIUM').length;
  const low = issues.filter(i => i.severity === 'LOW').length;

  const sColor = (s) => s === 'HIGH' ? C.danger : s === 'MEDIUM' ? C.warning : C.success;
  const sBg = (s) => s === 'HIGH' ? '#ef444415' : s === 'MEDIUM' ? '#f59e0b15' : '#22c55e15';

  return (
    <div style={S.wrap}>
      <h2 style={S.heading}>Data Quality Report</h2>
      <div style={S.bar} />
      <div style={S.summary}>
        <SCard label="Issues Found" value={issues.length} color={C.text} />
        <SCard label="High Severity" value={high} color={C.danger} />
        <SCard label="Medium Severity" value={medium} color={C.warning} />
        <SCard label="Low Severity" value={low} color={C.success} />
        <SCard label="Records Processed" value={employees.length} color={C.text} />
      </div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr style={{ backgroundColor: C.bg }}>
              {['#', 'Issue', 'Detail', 'Affected', 'Fix Applied', 'Severity'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id} style={S.tr}>
                <td style={{ ...S.td, color: C.muted }}>{issue.id}</td>
                <td style={{ ...S.td, fontWeight: '700', color: C.text }}>{issue.issue}</td>
                <td style={{ ...S.td, color: C.muted, maxWidth: '260px', lineHeight: '1.5' }}>{issue.detail}</td>
                <td style={{ ...S.td, textAlign: 'center', fontWeight: '700', color: C.text }}>{issue.affected}</td>
                <td style={{ ...S.td, color: C.success, maxWidth: '220px', lineHeight: '1.5' }}>{issue.fix}</td>
                <td style={S.td}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '2px', color: sColor(issue.severity), backgroundColor: sBg(issue.severity), letterSpacing: '1px', fontFamily: C.font }}>
                    {issue.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SCard({ label, value, color }) {
  return (
    <div style={S.scard}>
      <div style={{ fontSize: '32px', fontWeight: '800', color, fontFamily: C.font, marginBottom: '6px' }}>{value}</div>
      <div style={{ fontSize: '10px', color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: C.font }}>{label}</div>
    </div>
  );
}

const S = {
    wrap: { marginBottom: '56px', paddingBottom: '56px', borderBottom: '1px solid #e2e8f0' },
  heading: { fontSize: '11px', letterSpacing: '3px', color: C.text, marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase', fontFamily: C.font },
  bar: { height: '2px', backgroundColor: C.accent, width: '48px', marginBottom: '24px' },
  summary: { display: 'flex', gap: '16px', marginBottom: '24px' },
  scard: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.accent}`, borderRadius: '2px', padding: '20px 24px', flex: 1, textAlign: 'center' },
  tableWrap: { backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: '2px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: C.font },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', color: C.muted, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', fontWeight: '600', textTransform: 'uppercase' },
  tr: { borderBottom: `1px solid ${C.border}` },
  td: { padding: '14px 16px', color: C.muted, verticalAlign: 'top' }
};

export default DataQuality;