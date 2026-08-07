import { AmbientLight } from "./ambient-light";
import { AuraSmokeCursor } from "./aura-smoke-cursor";
import { EdgeMist } from "./edge-mist";
import styles from "./portfolio-atmosphere.module.css";

export function PortfolioAtmosphere() {
  return (
    <div aria-hidden="true" className={styles.root}>
      <AmbientLight />
      <div className={styles.baseWash} />
      <div className={styles.topHighlight} />
      <EdgeMist />
      <AuraSmokeCursor />
    </div>
  );
}
