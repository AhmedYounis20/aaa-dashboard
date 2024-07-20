type LoaderProps = {
  height?: string | number;
  color?: string;
};

function Loader({ height = "60vh", color = "text-primary" }: LoaderProps) {
  return (
    <div
      className="d-flex flex-row align-items-center justify-content-center"
      style={{ height }}
    >
      <div className={`spinner-border ${color}`} role="status" />
    </div>
  );
}

export default Loader;
