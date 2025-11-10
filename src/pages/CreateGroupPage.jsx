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

const CreateGroupPage = () => {
  const [totalGroups, setTotalGroups] = useState(0);
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTotalGroups = async () => {
      try {
        const apiResult = await fetchTotalGroups();
        if (apiResult.success) {
          setTotalGroups(apiResult.result.count);
        } else {
          console.error("그룹 수 조회 실패:", apiResult.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTotalGroups();
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
