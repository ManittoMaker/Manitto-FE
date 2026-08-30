import React from "react";
import { Box, Typography, Button } from "@mui/material";

// 렌더 에러 발생 시 백지 화면 대신 안내를 보여주는 최상위 에러 경계
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("렌더링 오류:", error, info);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 3 }}>
            🎁 마니또 메이커 🎁
          </Typography>
          <img
            src="/dog_blank.PNG"
            alt=""
            style={{ width: "12rem", maxHeight: "12rem", objectFit: "cover" }}
          />
          <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 1.5 }}>
            😥 문제가 발생했어요
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            화면을 표시하는 중 오류가 발생했어요.
            <br />
            처음으로 돌아가서 다시 시도해주세요.
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={this.handleReload}>
            처음으로 돌아가기
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
