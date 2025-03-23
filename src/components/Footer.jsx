import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        px: 2,
        textAlign: "center",
        backgroundColor: "#111",
        color: "#ccc",
      }}
    >
      <Typography variant="body2">
        생성된 지 <strong>1개월이 지난 그룹</strong>은 자동으로 삭제됩니다.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        마니또 결과를 확인하려면 <strong>잊지 말고 미리 확인</strong>해 주세요!
      </Typography>
    </Box>
  );
};

export default Footer;
