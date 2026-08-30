import { createTheme } from "@mui/material/styles";

// 마니또 메이커 공통 테마
// 페이지마다 하드코딩되어 있던 핑크 계열 색상을 팔레트로 통합
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ED4264", // 메인 핑크
      light: "#FF85A2", // 밝은 핑크 (강조/호버)
      dark: "#D81B60", // 진한 핑크 (아웃라인 버튼)
    },
    secondary: {
      main: "#ffd2e5", // 파스텔 핑크 (본문 강조 텍스트)
      light: "#ffe9f2",
      dark: "#ffabd8",
    },
    success: {
      main: "#81c784", // 다크 배경에서 대비가 확보되는 초록
    },
  },
  typography: {
    fontFamily: "Nanum Gothic",
    h1: {
      fontWeight: "bold",
      fontSize: "2.5rem",
      textAlign: "center",
      color: "#d32f2f",
      fontFamily: "Gaegu",
    },
    h2: {
      fontWeight: "500",
      fontSize: "1.8rem",
      color: "#388e3c",
      fontFamily: "Gaegu",
    },
    h3: {
      fontFamily: "Gaegu",
    },
    h4: {
      fontFamily: "Gaegu",
    },
    h5: {
      fontFamily: "Gaegu",
    },
    h6: {
      fontFamily: "Gaegu",
      fontSize: "1.5rem",
    },
  },
  components: {
    // 모바일 터치 타깃 확보 (최소 44px)
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
