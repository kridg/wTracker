const EmptyState = ({ title, action }) => (
  <div style={{ textAlign: "center", padding: "3rem", opacity: 0.8 }}>
    <h3>{title}</h3>
    {action}
  </div>
);

export default EmptyState;