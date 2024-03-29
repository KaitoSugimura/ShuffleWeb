import { useEffect, useState } from "react";
import styles from "./Background.module.css";

export default function Background({src}) {
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth * 0.5) * 0.002;
      const y = (clientY - window.innerHeight * 0.5) * -0.002;

      setTiltValues({ x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.BackgroundPerspective}>
      <div
        className={styles.Background}
        style={{
          backgroundImage: `url(${src})`,
          transform: `rotateX(${tiltValues.y}deg) rotateY(${tiltValues.x}deg)`,
        }}
      ></div>
    </div>
  );
}
