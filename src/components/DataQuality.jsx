function DataQuality({ employees }) {
    const issues = [
      {
        id: 1,
        issue: "Inconsistent office names",
        detail: "LDN and London used interchangeably for the same office",
        affected: 90, // hardcoded — original LDN values standardised to London in pipeline, original count from pandas analysis
        fix: "Standardised all LDN → London",
        severity: "MEDIUM"
      },
      {
        id: 2,
        issue: "Lowercase first names",
        detail: "Multiple employees had lowercase 'Known As' values e.g. deborah, mohammed",
        affected: 12,
        fix: "Applied title case to all name fields",
        severity: "LOW"
      },
      {
        id: 3,
        issue: "Invalid grade value",
        detail: "Grade column contains 'High' — valid values are A–E only",
        affected: employees.filter(e => !e.Grade_valid).length,
        fix: "Flagged as Grade_valid = false for investigation",
        severity: "HIGH"
      },
      {
        id: 4,
        issue: "FTE values exceeding 1.0",
        detail: "FTE of 1.2 recorded — a single employee cannot exceed 1.0 FTE",
        affected: employees.filter(e => !e.FTE_valid).length,
        fix: "Flagged as FTE_valid = false for HR review",
        severity: "HIGH"
      },
      {
        id: 5,
        issue: "Duplicate email addresses",
        detail: "3 records share an email address — each employee should have a unique email",
        affected: employees.filter(e => e.Email_duplicate).length,
        fix: "Flagged as Email_duplicate = true for investigation",
        severity: "HIGH"
      },
      {
        id: 6,
        issue: "Dates stored as text",
        detail: "Start date, leave date and FTC end date stored as strings not datetime",
        affected: employees.length,
        fix: "Parsed all date columns to datetime64 with dayfirst=True",
        severity: "MEDIUM"
      },
      {
        id: 7,
        issue: "Unknown manager placeholder",
        detail: "'Unknown Manager' used where line manager is not assigned",
        affected: employees.filter(e => !e.Manager_known).length,
        fix: "Flagged as Manager_known = false — requires HR data entry",
        severity: "MEDIUM"
      },
      {
        id: 8,
        issue: "Inconsistent manager name format",
        detail: "Some managers include titles (Dr, Mr, Miss) others do not",
        affected: 24,
        fix: "Stripped titles from Line Manager field using regex",
        severity: "LOW"
      },
      {
        id: 9,
        issue: "Missing FTC end dates for FTC employees",
        detail: "Some FTC employees have no FTC End Date recorded",
        affected: employees.filter(e => e['Employment Type'] === 'FTC' && !e['FTC End Date']).length,
        fix: "Flagged for HR review — contract end date is required for FTC staff",
        severity: "HIGH"
      },
    ];
  
    const severityColor = (s) => s === 'HIGH' ? '#c0392b' : s === 'MEDIUM' ? '#e67e22' : '#27ae60';
    const severityBg = (s) => s === 'HIGH' ? '#fdf0ef' : s === 'MEDIUM' ? '#fef9f0' : '#f0faf4';
  
    const high = issues.filter(i => i.severity === 'HIGH').length;
    const medium = issues.filter(i => i.severity === 'MEDIUM').length;
    const low = issues.filter(i => i.severity === 'LOW').length;
  
    return (
      <div style={styles.wrap}>
        <h2 style={styles.heading}>Data Quality Report</h2>
        <div style={styles.headingBar} />
  
        <div style={styles.summary}>
          <SummaryCard label="Issues Found" value={issues.length} color="#1a1a1a" />
          <SummaryCard label="High Severity" value={high} color="#c0392b" />
          <SummaryCard label="Medium Severity" value={medium} color="#e67e22" />
          <SummaryCard label="Low Severity" value={low} color="#27ae60" />
          <SummaryCard label="Records Processed" value={employees.length} color="#1a1a1a" />
        </div>
  
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Issue</th>
                <th style={styles.th}>Detail</th>
                <th style={styles.th}>Records Affected</th>
                <th style={styles.th}>Fix Applied</th>
                <th style={styles.th}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} style={styles.tr}>
                  <td style={styles.td}>{issue.id}</td>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#1a1a1a' }}>{issue.issue}</td>
                  <td style={{ ...styles.td, color: '#666', maxWidth: '280px' }}>{issue.detail}</td>
                  <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>{issue.affected}</td>
                  <td style={{ ...styles.td, color: '#27ae60', maxWidth: '240px' }}>{issue.fix}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      color: severityColor(issue.severity),
                      backgroundColor: severityBg(issue.severity),
                      border: `1px solid ${severityColor(issue.severity)}33`
                    }}>
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
  
  function SummaryCard({ label, value, color }) {
    return (
      <div style={styles.summaryCard}>
        <div style={{ ...styles.summaryNum, color }}>{value}</div>
        <div style={styles.summaryLabel}>{label}</div>
      </div>
    );
  }
  
  const styles = {
    wrap: { marginBottom: '48px' },
    heading: { fontSize: '11px', letterSpacing: '3px', color: '#1a1a1a', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' },
    headingBar: { height: '3px', backgroundColor: '#c4d600', width: '48px', marginBottom: '24px' },
    summary: { display: 'flex', gap: '16px', marginBottom: '24px' },
    summaryCard: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderTop: '3px solid #c4d600', borderRadius: '2px', padding: '20px 24px', flex: 1, textAlign: 'center' },
    summaryNum: { fontSize: '32px', fontWeight: '700', marginBottom: '6px' },
    summaryLabel: { fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' },
    tableWrap: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '2px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    theadRow: { backgroundColor: '#f8f8f6' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: '10px', letterSpacing: '2px', color: '#666', borderBottom: '2px solid #e5e5e5', whiteSpace: 'nowrap', fontWeight: '600', textTransform: 'uppercase' },
    tr: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '14px 16px', color: '#1a1a1a', verticalAlign: 'top', lineHeight: '1.5' },
    badge: { fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '2px', letterSpacing: '1px' }
  };
  
  export default DataQuality;