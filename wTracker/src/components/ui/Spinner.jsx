const Spinner = () => (
  <div className="wt-loading-shell">
    <div className="flex flex-col items-center justify-center">
      <div className="wt-spinner-orbit" />
      <p className="wt-spinner-label tracking-[0.2em]">Loading</p>
    </div>
  </div>
)

export default Spinner;