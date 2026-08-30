import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

// 존재하지 않는 URL 접근 시 표시되는 404 화면
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
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
          🔍 페이지를 찾을 수 없어요
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          주소가 잘못되었거나 삭제된 그룹이에요.
          <br />
          공유받은 링크를 다시 확인해주세요.
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
          메인으로 가기
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
