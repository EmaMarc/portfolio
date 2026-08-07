import styles from "./portfolio-atmosphere.module.css";

const edgeMistMasses = [
  {
    breathClassName: styles.edgeMistBreathLeftTop,
    driftClassName: styles.edgeMistDriftLeftTop,
    id: "left-top",
  },
  {
    breathClassName: styles.edgeMistBreathLeftBottom,
    driftClassName: styles.edgeMistDriftLeftBottom,
    id: "left-bottom",
  },
  {
    breathClassName: styles.edgeMistBreathRightTop,
    driftClassName: styles.edgeMistDriftRightTop,
    id: "right-top",
  },
  {
    breathClassName: styles.edgeMistBreathRightBottom,
    driftClassName: styles.edgeMistDriftRightBottom,
    id: "right-bottom",
  },
  {
    breathClassName: styles.edgeMistBreathTop,
    driftClassName: styles.edgeMistDriftTop,
    id: "top",
  },
  {
    breathClassName: styles.edgeMistBreathBottom,
    driftClassName: styles.edgeMistDriftBottom,
    id: "bottom",
  },
] as const;

export function EdgeMist() {
  return (
    <div className={styles.edgeMistField}>
      {edgeMistMasses.map((mass) => (
        <div
          className={`${styles.edgeMistDrift} ${mass.driftClassName}`}
          key={mass.id}
        >
          <div
            className={`${styles.edgeMistBreath} ${mass.breathClassName}`}
          />
        </div>
      ))}
    </div>
  );
}
