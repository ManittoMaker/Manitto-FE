import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, Snackbar, Alert } from "@mui/material";
// 변경: react-confetti 대신 canvas-confetti import
import confetti from "canvas-confetti";
import GoogleAd from "../components/GoogleAdComponent";
import { fetchUserMatch } from "../api/fetchUserMatch";
import apiClient from "../api/apiClient";

const ShowPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [groupName, setGroupName] = useState("");
  
  // 변경: confettiActive state는 더 이상 필요 없어서 삭제했습니다.

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // 그룹 이름 가져오기
  useEffect(() => {
    let cancelled = false; // 언마운트 후 setState 방지 가드

    const fetchGroupName = async () => {
      try {
        const response = await apiClient.get(`/api/groups/${groupId}/name`);
        if (cancelled) return;
        if (response.data.success && response.data.result?.groupName) {
          setGroupName(response.data.result.groupName);
        } else {
          setGroupName("알 수 없는 그룹");
        }
      } catch {
        if (!cancelled) setGroupName("알 수 없는 그룹");
      }
    };

    fetchGroupName();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 변경: 결과(result)가 나오면 자동으로 폭죽 효과 실행
  useEffect(() => {
    if (result) {
      const duration = 3 * 1000; // 3초 동안 실행
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 양쪽에서 팡팡 터지는 효과
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [result]);

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
        // 변경: 여기서 setConfettiActive(true)를 할 필요가 없어졌습니다. (useEffect가 처리)
      } else {
        setSnackbarMessage(apiResult.message || "이름 또는 비밀번호가 잘못되었습니다.");
        setSnackbarOpen(true);
      }
    } catch {
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
        {/* 변경: <Confetti /> 컴포넌트 삭제 (canvas-confetti는 화면 위에 직접 그립니다) */}
        
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