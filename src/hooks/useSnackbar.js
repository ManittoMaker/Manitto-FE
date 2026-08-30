import { useState, useCallback } from "react";

// 페이지마다 중복 선언되던 스낵바 state를 하나의 훅으로 통합
// 사용법: const { showSnackbar, snackbarProps } = useSnackbar();
//        showSnackbar("메시지", "success");
//        <AppSnackbar {...snackbarProps} />
const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showSnackbar = useCallback((msg, sev = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const onClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  return {
    showSnackbar,
    snackbarProps: { open, message, severity, onClose },
  };
};

export default useSnackbar;
