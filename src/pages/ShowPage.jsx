import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from "@mui/material";
import Confetti from "react-confetti";
import GoogleAd from "../components/GoogleAdComponent";
import { fetchUserMatch } from "../api/fetchUserMatch";
import axios from "axios";

const ShowPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/groups/${groupId}/name`
        );
        if (response.data.success && response.data.result?.groupName) {
          setGroupName(response.data.result.groupName);
        } else {
          setGroupName("알 수 없는 그룹");
        }
      } catch (error) {
        setGroupName("알 수 없는 그룹");
      }
    };

    fetchGroupName();
  }, [groupId]);

  const handleSubmit = async () => {
    if (!name.trim() || !password.trim()) {
      setSnackbarMessage("이름과 비밀번호를 모두 입력해주세요.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const apiResult = await fetchUserMatch(groupId, name.trim(), password.trim());

      if (apiResult.success && apiResult.result) {
        setResult({
          giver: name,
          receiver: apiResult.result.receiver,
        });
        setConfettiActive(true);
      } else {
        setSnackbarMessage(apiResult.message || "이름 또는 비밀번호가 잘못되었습니다.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("결과를 불러오는 중 오류가 발생했습니다.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        {confettiActive && <Confetti />}
        <Typography variant="h5" sx={{ marginBottom: 1, color: "#b2dfdb" }}>
          🎁 {groupName} 🎁
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          매칭 결과 확인
        </Typography>
        <TextField
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          결과 확인
        </Button>

        {result && (
          <>
            <Typography sx={{ marginTop: 4 }}>
              <Typography
                component="span"
                color="secondary"
                sx={{ marginRight: 0.5, fontSize: "1.5rem" }}
              >
                {result.giver}
              </Typography>
              님은
              <Typography
                component="span"
                color="secondary"
                sx={{ marginLeft: 0.5, fontSize: "1.5rem" }}
              >
                {result.receiver}
              </Typography>
              님의 마니또입니다 :D
            </Typography>
            <Typography>특별한 선물🎁 을 준비해주세요!</Typography>
            <Button
              variant="outlined"
              sx={{ marginTop: 4 }}
              onClick={() => navigate("/")}
            >
              메인으로 가기
            </Button>
            <GoogleAd />
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="warning" variant="filled" onClose={handleCloseSnackbar}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ShowPage;
