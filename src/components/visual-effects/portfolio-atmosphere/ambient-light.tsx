import styles from "./portfolio-atmosphere.module.css";

const ambientLightMasses = [
  { className: styles.ambientPrimary, id: "primary" },
  { className: styles.ambientSecondary, id: "secondary" },
  { className: styles.ambientTertiary, id: "tertiary" },
  { className: styles.ambientTransition, id: "transition" },
] as const;

export function AmbientLight() {
  return (
    <div className={styles.ambientLayer}>
      {ambientLightMasses.map((mass) => (
        <div
          className={`${styles.ambientMass} ${mass.className}`}
          key={mass.id}
        />
      ))}
    </div>
  );
}
