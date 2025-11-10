import Snowfall from "react-snowfall";

const SnowfallEffect = () => {
  return (
    <Snowfall
      color="#ffffff"
      snowflakeCount={120}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none", 
      }}
    />
  );
};

export default SnowfallEffect;
