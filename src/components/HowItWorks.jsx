import { Box, Typography, Stack } from "@mui/material";

// 서비스 진행 방식 안내 겸 스텝 인디케이터
// activeStep에 해당하는 카드만 핑크로 강조되어 현재 단계를 보여줌
const STEPS = [
  { number: "①", label: "그룹 만들기", detail: "리더가 그룹을 생성해요" },
  { number: "②", label: "참가자 입력", detail: "이름만 넣으면 자동 매칭" },
  { number: "③", label: "카톡으로 공유", detail: "각자 몰래 결과 확인" },
];

const HowItWorks = ({ activeStep = 0 }) => {
  return (
    <Box sx={{ my: 3 }}>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        justifyContent="center"
        alignItems="stretch"
      >
        {STEPS.map((step, index) => {
          const isActive = index === activeStep;
          return (
            <Box
              key={step.number}
              sx={{
                flex: 1,
                maxWidth: { sm: 180 },
                minWidth: 0, // 좁은 화면에서 카드가 줄어들 수 있게
                px: { xs: 0.5, sm: 2 },
                py: { xs: 0.75, sm: 1.5 },
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "1px solid",
                // 현재 단계만 선명한 핑크, 나머지는 흐리게
                borderColor: isActive
                  ? "primary.main"
                  : "rgba(255, 255, 255, 0.12)",
                backgroundColor: isActive
                  ? "rgba(237, 66, 100, 0.12)"
                  : "transparent",
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontFamily: "Gaegu",
                  // 모바일에선 작게 — 스텝 인디케이터처럼 보이도록
                  fontSize: { xs: "0.85rem", sm: "1.2rem" },
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  color: isActive ? "secondary.dark" : "text.secondary",
                }}
              >
                {step.number} {step.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  // 모바일에선 설명 숨김 (카드가 스텝 인디케이터 역할)
                  display: { xs: "none", sm: "block" },
                  color: "text.secondary",
                  fontSize: "0.7rem",
                  whiteSpace: "nowrap", // 두 줄로 꺾이지 않게
                }}
              >
                {step.detail}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default HowItWorks;
