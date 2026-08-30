import { Box, Typography, Stack } from "@mui/material";

// 리더 플로우의 현재 위치를 보여주는 스텝 인디케이터
// activeStep: 0=그룹 만들기, 1=참가자 입력, 2=결과 공유
const STEPS = ["그룹 만들기", "참가자 입력", "결과 공유"];

const StepIndicator = ({ activeStep, sx }) => {
  return (
    <Stack
      direction="row"
      spacing={0}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 3, mb: 1, ...sx }}
      aria-label={`진행 단계: 3단계 중 ${activeStep + 1}단계`}
    >
      {STEPS.map((label, index) => {
        const isActive = index === activeStep;
        const isDone = index < activeStep;
        return (
          <Stack key={label} direction="row" alignItems="center">
            {index > 0 && (
              <Box
                sx={{
                  width: { xs: 16, sm: 32 },
                  height: "2px",
                  mx: 0.5,
                  backgroundColor: isDone || isActive
                    ? "primary.main"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              />
            )}
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: isActive || isDone ? "#fff" : "text.secondary",
                  backgroundColor: isActive
                    ? "primary.main"
                    : isDone
                      ? "primary.dark"
                      : "rgba(255, 255, 255, 0.12)",
                }}
              >
                {isDone ? "✓" : index + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: isActive ? "block" : "none", sm: "block" },
                  color: isActive ? "secondary.main" : "text.secondary",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {label}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default StepIndicator;
