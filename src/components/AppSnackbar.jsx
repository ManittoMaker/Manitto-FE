import { Snackbar, Alert } from "@mui/material";

// useSnackbar 훅과 짝을 이루는 공통 스낵바 (위치/스타일 통일)
const AppSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      key={message} // 메시지가 바뀌면 autoHide 타이머도 새로 시작
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;
