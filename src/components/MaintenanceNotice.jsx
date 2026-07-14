import { Box, Typography } from "@mui/material";

// 서버 응답이 없을 때 표시되는 시스템 점검 안내 화면
const MaintenanceNotice = () => {
  return (
    <Box
      sx={{
        minHeight: "75vh", // 푸터를 제외한 영역에서 세로 가운데 정렬
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
        alt="시스템 점검 중"
        style={{ width: "15rem", maxHeight: "15rem", objectFit: "cover" }}
      />
      <Typography variant="h5" sx={{ marginTop: 3, marginBottom: 1.5 }}>
        🔧 시스템 점검 중이에요
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        더 좋은 모습으로 돌아오기 위해
        <br />
        서버를 열심히 고치고 있어요 🔧
        <br />
        조금만 기다려주세요~ 🙏
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginTop: 2, opacity: 0.7 }}
      >
        금방 다시 만나요!
      </Typography>
    </Box>
  );
};

export default MaintenanceNotice;
