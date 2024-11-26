import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { addGroupToFirestore, checkGroupDuplicate } from "../firebase/addGroup";
import { useNavigate } from "react-router-dom";

const CreateGroupPage = () => {
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    if (!leaderName.trim() || !groupName.trim()) {
      setSnackbarMessage("리더 이름과 그룹 이름을 모두 입력하세요.");
      setAlertSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    const isDuplicate = await checkGroupDuplicate(groupName, leaderName);
    if (isDuplicate) {
      setSnackbarMessage(
        "이미 같은 이름의 그룹 또는 리더가 존재합니다. 다른 이름을 사용해주세요."
      );
      setAlertSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const groupId = await addGroupToFirestore(leaderName, groupName);
      navigate(`/inputNames/${groupId}`);
    } catch (error) {
      console.error("그룹 생성 중 오류:", error);
      setSnackbarMessage("그룹 생성에 실패했습니다. 다시 시도해주세요.");
      setAlertSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCheckPreviousResults = () => {
    navigate("/checkResults");
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 1 }}>
          🎄 마니또 생성기 🎅
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
          mr: "auto",
          ml: "auto",
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
