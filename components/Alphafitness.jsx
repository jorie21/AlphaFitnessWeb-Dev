
export default function AlphaFitness({ className = "" }) {
  return (
   <span
      className={`${className}`}
      style={{ fontFamily: "var(--AlphaFitness)" }}
    >
      <span style={{color: "var(--primary)"}}>ALPHA </span><span style={{color: "var(--secondary)"}}>FITNESS</span>
    </span>
  );
}