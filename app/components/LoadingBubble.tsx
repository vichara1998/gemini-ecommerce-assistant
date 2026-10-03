const LoadingBubble = () => {
  return (
    <div className="loader-wrap" role="status" aria-label="Assistant is typing">
      <div className="assistant-avatar" aria-hidden="true">s</div>
      <div className="loader" aria-hidden="true"><span /><span /><span /></div>
      <span>Shopmate is typing…</span>
    </div>
  );
};

export default LoadingBubble;
