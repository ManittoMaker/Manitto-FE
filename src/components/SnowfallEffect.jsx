import Snowfall from "react-snowfall";

const SnowfallEffect = ({
  color = "white",
  snowflakeCount = 100,
  style = {},
}) => {
  return (
    <div
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Snowfall color={color} snowflakeCount={snowflakeCount} />
    </div>
  );
};

export default SnowfallEffect;
