import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../api/createGroup";
import { fetchTotalGroups } from "../api/fetchTotalGroups";
import MaintenanceNotice from "../components/MaintenanceNotice";
import HowItWorks from "../components/HowItWorks";
import AppSnackbar from "../components/AppSnackbar";
import CountUpNumber from "../components/CountUpNumber";
import useSnackbar from "../hooks/useSnackbar";

const CreateGroupPage = () => {
  // 그룹 수는 백그라운드로 로드 — 폼은 API 응답과 무관하게 즉시 렌더
  const [totalGroups, setTotalGroups] = useState(null);
  const [isServerDown, setIsServerDown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  // 인라인 필드 검증 — 어느 필드가 비었는지 해당 필드에 직접 표시
  const [fieldErrors, setFieldErrors] = useState({ leaderName: false, groupName: false });
  const { showSnackbar, snackbarProps } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false; // 언마운트 후 setState 방지 가드

    // 안전장치: 요청이 어떤 이유로든 8초 이상 pending 상태면 점검 중 화면으로 강제 전환
    const fallbackTimer = setTimeout(() => {
      console.error("서버 응답 시간 초과 — 점검 중 화면으로 전환");
      setIsServerDown(true);
    }, 8000);

    const loadTotalGroups = async () => {
      try {
        const apiResult = await fetchTotalGroups();
        if (cancelled) return;
        if (apiResult.success) {
          setTotalGroups(apiResult.result?.count ?? 0); // 응답 형식이 달라도 안전하게 처리
          setIsServerDown(false); // 늦게라도 정상 응답이 오면 점검 상태 해제
        } else {
          console.error("그룹 수 조회 실패:", apiResult.message);
          setIsServerDown(true); // 서버 응답은 있으나 실패한 경우도 점검 중으로 처리
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setIsServerDown(true); // 서버 연결 실패 시 점검 중 화면 표시
      } finally {
        clearTimeout(fallbackTimer); // 응답이 오면 안전장치 타이머 해제
      }
    };

    loadTotalGroups();

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer); // 언마운트 시 타이머 정리
    };
  }, []);

  const handleCreateGroup = async () => {
    // 빈 필드는 인라인 에러로 표시
    const errors = {
      leaderName: !leaderName.trim(),
      groupName: !groupName.trim(),
    };
    if (errors.leaderName || errors.groupName) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true); // 중복 클릭 방지
    try {
      const groupId = await createGroup(groupName, leaderName);
      if (!groupId) throw new Error("그룹 ID를 받아오지 못했습니다.");

      navigate(`/inputNames/${groupId}`);
    } catch (error) {
      console.error("그룹 생성 중 오류:", error);
      showSnackbar(
        error.message || "그룹 생성에 실패했습니다. 다시 시도해주세요.",
        "error"
      );
      setIsSubmitting(false); // 실패 시에만 해제 (성공 시엔 페이지 이동)
    }
  };

  const handleCheckPreviousResults = () => {
    navigate("/checkResults");
  };

  // 서버 접속 불가 시 시스템 점검 중 화면 표시
  if (isServerDown) {
    return (
      <Container>
        <MaintenanceNotice />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 1 }}>
          🎁 마니또 메이커 🎁
        </Typography>
        {totalGroups !== null && (
          <Typography variant="body2" color="text.secondary">
            지금까지 만들어진 그룹 수는{" "}
            <Box
              component="strong"
              sx={{ color: "secondary.main", fontSize: "1.05rem" }}
            >
              <CountUpNumber value={totalGroups} />
            </Box>
            개 입니다.
          </Typography>
        )}
        <img
          src="/Manito.png"
          alt=""
          style={{ width: "13rem", maxHeight: "13rem", objectFit: "cover" }}
        />
        <HowItWorks activeStep={0} />
        <TextField
          label="리더 이름"
          placeholder="예: 김철수"
          value={leaderName}
          onChange={(e) => {
            setLeaderName(e.target.value);
            if (fieldErrors.leaderName)
              setFieldErrors((prev) => ({ ...prev, leaderName: false }));
          }}
          error={fieldErrors.leaderName}
          helperText={
            fieldErrors.leaderName
              ? "리더 이름을 입력해주세요."
              : "그룹을 만드는 사람의 이름이에요."
          }
          fullWidth
          autoComplete="off"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="그룹 이름"
          placeholder="예: 우리반 마니또"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            if (fieldErrors.groupName)
              setFieldErrors((prev) => ({ ...prev, groupName: false }));
          }}
          error={fieldErrors.groupName}
          helperText={fieldErrors.groupName ? "그룹 이름을 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCreateGroup}
          disabled={isSubmitting}
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "그룹 만들기"
          )}
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
      <AppSnackbar {...snackbarProps} />
    </Container>
  );
};

export default CreateGroupPage;
