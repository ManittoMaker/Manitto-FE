import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = ({ size = 40, color = "primary" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default LoadingSpinner;
