import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppSnackbar from "../components/AppSnackbar";
import useSnackbar from "../hooks/useSnackbar";
import { fetchGroupResults } from "../api/fetchGroupResults";
import { shareOrCopy } from "../utils/share";

const CheckResultsPage = () => {
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [results, setResults] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    leaderName: false,
    groupName: false,
    password: false,
  });
  const [showFullResults, setShowFullResults] = useState(false);
  const { showSnackbar, snackbarProps } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // 빈 필드는 인라인 에러로 표시
    const errors = {
      leaderName: !leaderName.trim(),
      groupName: !groupName.trim(),
      password: !password.trim(),
    };
    if (errors.leaderName || errors.groupName || errors.password) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true); // 중복 클릭 방지
    try {
      const apiResult = await fetchGroupResults(leaderName, groupName, password);

      if (apiResult.success && apiResult.result?.result?.length > 0) {
        setResults(apiResult.result.result);
        setGroupId(apiResult.result.groupId);
        showSnackbar("성공적으로 결과를 가져왔습니다.", "success");
      } else {
        let msg = apiResult.message || "일치하는 결과가 없습니다.";

        switch (apiResult.code) {
          case -400:
            msg = "입력하신 정보와 일치하는 그룹이 존재하지 않습니다.";
            break;
          case -102:
            msg = "잘못된 파라미터입니다. 입력값을 다시 확인해주세요.";
            break;
        }

        setResults([]);
        showSnackbar(msg, "error");
      }
    } catch (error) {
      console.error("결과 확인 실패:", error);
      showSnackbar("결과를 불러오는 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleChange = (event) => {
    setShowFullResults(event.target.checked);
  };

  const handleToMain = () => {
    navigate("/");
  };

  const handleCopyInvitationURL = async () => {
    const invitationURL = `https://manittomaker.com/showResult/${groupId}`;
    try {
      const outcome = await shareOrCopy(invitationURL);
      if (outcome === "copied") {
        showSnackbar("초대 URL이 클립보드에 성공적으로 복사되었습니다! 🎉", "success");
      }
    } catch (error) {
      console.error("공유 실패:", error);
      showSnackbar("공유에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  // 입력 시 인라인 에러 해제 헬퍼
  const clearFieldError = (field) =>
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          마니또 결과 확인
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          리더용 페이지예요. 그룹을 만들 때 받은 정보로
          <br />
          전체 매칭 결과와 참가자 비밀번호를 다시 볼 수 있어요.
        </Typography>
        <TextField
          label="리더 이름"
          value={leaderName}
          onChange={(e) => {
            setLeaderName(e.target.value);
            clearFieldError("leaderName");
          }}
          error={fieldErrors.leaderName}
          helperText={fieldErrors.leaderName ? "리더 이름을 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ mb: 1 }}
        />
        <TextField
          label="그룹 이름"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            clearFieldError("groupName");
          }}
          error={fieldErrors.groupName}
          helperText={fieldErrors.groupName ? "그룹 이름을 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ mb: 1 }}
        />
        <TextField
          label="비밀번호"
          placeholder="그룹 생성 시 받은 비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError("password");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit();
          }}
          error={fieldErrors.password}
          helperText={fieldErrors.password ? "비밀번호를 입력해주세요." : " "}
          fullWidth
          autoComplete="off"
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={
            <Switch checked={showFullResults} onChange={handleToggleChange} />
          }
          label={showFullResults ? "전체 결과 보기" : "비밀번호만 보기"}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "결과 확인"}
        </Button>
        {results.length > 0 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              {showFullResults ? (
                <>
                  <Typography variant="h6">🎉 전체 결과 🎉</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    리더: {leaderName} | 그룹명: {groupName}
                  </Typography>
                  {results.map((match) => (
                    <Typography key={match.giver} sx={{ mt: 1 }}>
                      {match.giver} ➡️ {match.receiver} (비밀번호:{" "}
                      {match.password})
                    </Typography>
                  ))}
                </>
              ) : (
                <>
                  <Typography variant="h6">🔐 비밀번호 정보 🔐</Typography>
                  {results.map((match) => (
                    <Typography key={match.giver} sx={{ mt: 1 }}>
                      {match.giver} (비밀번호: {match.password})
                    </Typography>
                  ))}
                </>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={handleCopyInvitationURL}
                sx={{
                  mt: 2,
                  mx: "auto",
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                }}
              >
                초대 URL 복사
              </Button>
            </CardContent>
          </Card>
        )}
        <Button
          variant="outlined"
          onClick={handleToMain}
          sx={{
            mt: 2,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            width: "120px",
          }}
        >
          메인으로
        </Button>
        <AppSnackbar {...snackbarProps} />
      </Box>
    </Container>
  );
};

export default CheckResultsPage;
