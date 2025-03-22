import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchGroupResults } from "../api/fetchGroupResults";

const CheckResultsPage = () => {
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [results, setResults] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showFullResults, setShowFullResults] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const apiResult = await fetchGroupResults(leaderName, groupName, password);
      if (apiResult.success && apiResult.result?.result.length > 0) {
        setResults(apiResult.result.result);
        setGroupId(apiResult.result.groupId);
        setSnackbarMessage("성공적으로 결과를 가져왔습니다.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        setResults([]);
        setSnackbarMessage(apiResult.message || "일치하는 결과가 없습니다.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("결과 확인 실패:", error);
      setSnackbarMessage("결과를 불러오는 중 오류가 발생했습니다.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleToggleChange = (event) => {
    setShowFullResults(event.target.checked);
  };

  const handleToMain = () => {
    navigate("/");
  };

  const handleCopyInvitationURL = () => {
    const invitationURL = `https://manittomaker.com/showResult/${groupId}`;
    navigator.clipboard.writeText(invitationURL);
    setSnackbarMessage("초대 URL이 클립보드에 성공적으로 복사되었습니다! 🎉");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          마니또 결과 확인
        </Typography>
        <TextField
          label="리더 이름"
          value={leaderName}
          onChange={(e) => setLeaderName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="그룹 이름"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch checked={showFullResults} onChange={handleToggleChange} />
          }
          label={showFullResults ? "전체 결과 보기" : "비밀번호만 보기"}
        />
        <Button variant="contained" onClick={handleSubmit}>
          결과 확인
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
                  {results.map((match, idx) => (
                    <Typography key={idx} sx={{ mt: 1 }}>
                      {match.giver} ➡️ {match.receiver} (비밀번호:{" "}
                      {match.password})
                    </Typography>
                  ))}
                </>
              ) : (
                <>
                  <Typography variant="h6">🔐 비밀번호 정보 🔐</Typography>
                  {results.map((match, idx) => (
                    <Typography key={idx} sx={{ mt: 1 }}>
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
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default CheckResultsPage;
