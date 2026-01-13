const EmptyState = ({ title, action }) => (
  <div className="wt-empty">
    <h3 className="wt-empty-title">{title}</h3>
    {action && <div className="wt-empty-hint">{action}</div>}
  </div>
)

export default EmptyState;