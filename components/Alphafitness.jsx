
export default function AlphaFitness({ className = "" }) {
  return (
   <h1
      className={`${className}`}
      style={{ fontFamily: "var(--AlphaFitness)" }}
    >
      <span style={{color: "var(--primary)"}}>ALPHA </span><span style={{color: "var(--secondary)"}}>FITNESS</span>
    </h1>
  );
}