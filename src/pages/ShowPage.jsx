import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import confetti from "canvas-confetti";
import GoogleAd from "../components/GoogleAdComponent";
import AppSnackbar from "../components/AppSnackbar";
import useSnackbar from "../hooks/useSnackbar";
import { fetchUserMatch } from "../api/fetchUserMatch";
import apiClient from "../api/apiClient";

const ShowPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ name: false, password: false });
  const { showSnackbar, snackbarProps } = useSnackbar();

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

  // 결과(result)가 나오면 자동으로 폭죽 효과 실행
  useEffect(() => {
    if (!result) return;
    // 모션 최소화 선호 시 폭죽 생략
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const duration = 3 * 1000; // 3초 동안 실행
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // 양쪽에서 팡팡 터지는 효과
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [result]);

  const handleSubmit = async () => {
    // 빈 필드는 인라인 에러로 표시
    const errors = { name: !name.trim(), password: !password.trim() };
    if (errors.name || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true); // 중복 클릭 방지
    try {
      const apiResult = await fetchUserMatch(groupId, name.trim(), password.trim());

      if (apiResult.success && apiResult.result) {
        setResult({
          giver: name,
          receiver: apiResult.result.receiver,
        });
      } else {
        showSnackbar(apiResult.message || "이름 또는 비밀번호가 잘못되었습니다.", "warning");
      }
    } catch {
      showSnackbar("결과를 불러오는 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 1, color: "#b2dfdb" }}>
          🎁 {groupName} 🎁
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          매칭 결과 확인
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          리더에게 전달받은 <strong>내 이름</strong>과 <strong>비밀번호</strong>를 입력하면
          <br />
          내가 누구의 마니또인지 확인할 수 있어요.
        </Typography>
        <TextField
          label="이름"
          placeholder="리더가 등록한 내 이름"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
          }}
          error={fieldErrors.name}
          helperText={fieldErrors.name ? "이름을 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="비밀번호"
          placeholder="카톡으로 전달받은 비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password)
              setFieldErrors((prev) => ({ ...prev, password: false }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit();
          }}
          error={fieldErrors.password}
          helperText={fieldErrors.password ? "비밀번호를 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "결과 확인"}
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

        <AppSnackbar {...snackbarProps} />
      </Box>
    </Container>
  );
};

export default ShowPage;
