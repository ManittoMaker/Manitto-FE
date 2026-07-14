import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createGroup } from '../api/createGroup';
import { fetchTotalGroups } from "../api/fetchTotalGroups";
import MaintenanceNotice from "../components/MaintenanceNotice";
import LoadingSpinner from "../components/LoadingSpinner";

const CreateGroupPage = () => {
  const [totalGroups, setTotalGroups] = useState(0);
  const [isServerDown, setIsServerDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const navigate = useNavigate();

  useEffect(() => {
    // 안전장치: 요청이 어떤 이유로든 8초 이상 pending 상태면 점검 중 화면으로 강제 전환
    const fallbackTimer = setTimeout(() => {
      console.error("서버 응답 시간 초과 — 점검 중 화면으로 전환");
      setIsServerDown(true);
      setIsLoading(false);
    }, 8000);

    const loadTotalGroups = async () => {
      try {
        const apiResult = await fetchTotalGroups();
        if (apiResult.success) {
          setTotalGroups(apiResult.result?.count ?? 0); // 응답 형식이 달라도 안전하게 처리
          setIsServerDown(false); // 늦게라도 정상 응답이 오면 점검 상태 해제
        } else {
          console.error("그룹 수 조회 실패:", apiResult.message);
          setIsServerDown(true); // 서버 응답은 있으나 실패한 경우도 점검 중으로 처리
        }
      } catch (error) {
        console.error(error);
        setIsServerDown(true); // 서버 연결 실패 시 점검 중 화면 표시
      } finally {
        clearTimeout(fallbackTimer); // 응답이 오면 안전장치 타이머 해제
        setIsLoading(false); // 성공/실패와 관계없이 로딩 종료
      }
    };

    loadTotalGroups();

    return () => clearTimeout(fallbackTimer); // 언마운트 시 타이머 정리
  }, []);

  const handleCreateGroup = async () => {
  if (!leaderName.trim() || !groupName.trim()) {
    setSnackbarMessage("리더 이름과 그룹 이름을 모두 입력하세요.");
    setAlertSeverity("warning");
    setOpenSnackbar(true);
    return;
  }

  try {
    const groupId = await createGroup(groupName, leaderName); 
    if (!groupId) throw new Error("그룹 ID를 받아오지 못했습니다.");

    setSnackbarMessage(`그룹이 성공적으로 생성되었습니다!`);
    setAlertSeverity("success");
    setOpenSnackbar(true);

    navigate(`/inputNames/${groupId}`); 
  } catch (error) {
  console.error("그룹 생성 중 오류:", error);
  let userMessage = error.message || "그룹 생성에 실패했습니다. 다시 시도해주세요.";

  setSnackbarMessage(userMessage);
  setAlertSeverity("error");
  setOpenSnackbar(true);
}
  }



  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleCheckPreviousResults = () => {
    navigate("/checkResults");
  };

  // 서버 응답을 기다리는 동안 로딩 스피너 표시
  if (isLoading) {
    return (
      <Container>
        <Box sx={{ marginTop: 12 }}>
          <LoadingSpinner />
        </Box>
      </Container>
    );
  }

  // 서버 접속 불가 시 시스템 점검 중 화면 표시
  if (isServerDown) {
    return (
      <Container>
        <MaintenanceNotice />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 1 }}>
          🎁 마니또 메이커 🎁
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          지금까지 만들어진 그룹 수는 <strong>{totalGroups}</strong>개 입니다.
        </Typography>
        <img
          src="/Manito.png"
          alt="Landing Image"
          style={{ width: "15rem", maxHeight: "15rem", objectFit: "cover" }}
        />
        <Typography variant="h5" gutterBottom>
          새로운 그룹 생성
        </Typography>
        <TextField
          label="리더 이름"
          value={leaderName}
          onChange={(e) => setLeaderName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="그룹 이름"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleCreateGroup}>
          그룹 생성
        </Button>
      </Box>
      <Button
        variant="outlined"
        onClick={handleCheckPreviousResults}
        sx={{
          mt: 2,
          mx: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        기존 마니또 결과 확인하기
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateGroupPage;
