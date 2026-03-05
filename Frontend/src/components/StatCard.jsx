export default function StatCard({ title, value, subtitle, color }) {
  
  return (
    <div className={`stat-card border-${color}`}>
      <h4>{title}</h4>
      <p className="value">{value}</p>
      {subtitle && <small>{subtitle}</small>}
    </div>
  );
}