import React, { useState } from "react";
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
import fetchResultsFromFirestore from "../firebase/fetchResults";
import { useNavigate } from "react-router-dom";

const CheckResultsPage = () => {
  const [leaderName, setLeaderName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [results, setResults] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // 추가된 상태
  const [showFullResults, setShowFullResults] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const fetchedResults = await fetchResultsFromFirestore(
        leaderName,
        groupName,
        password
      );
      if (fetchedResults.length > 0) {
        setResults(fetchedResults);
        setGroupId(fetchedResults[0].groupId);
      } else {
        setSnackbarMessage("입력하신 정보와 일치하는 결과가 없습니다.");
        setSnackbarSeverity("error"); // 실패 시 빨간색
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("결과 확인 실패:", error);
      setSnackbarMessage("결과를 불러오는 데 실패했습니다.");
      setSnackbarSeverity("error"); // 실패 시 빨간색
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
    const invitationURL = `https://manitto-73651.web.app/showResult/${groupId}`;
    navigator.clipboard.writeText(invitationURL);
    setSnackbarMessage("초대 URL이 클립보드에 성공적으로 복사되었습니다! 🎉");
    setSnackbarSeverity("success"); // 성공 시 초록색
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
        {results?.map((result, index) => (
          <Card key={index} sx={{ mt: 2 }}>
            <CardContent>
              {showFullResults ? (
                <>
                  <Typography variant="h6">전체 정보</Typography>
                  <Typography variant="h6">
                    {result.groupName}{" "}
                    {result.leaderName && `(${result.leaderName})`}
                  </Typography>
                  {result.matches &&
                    result.matches.map((match, idx) => (
                      <Typography key={idx} sx={{ mt: 1 }}>
                        {match.giver} ➡️ {match.receiver} (비밀번호:{" "}
                        {match.password})
                      </Typography>
                    ))}
                </>
              ) : (
                <>
                  <Typography variant="h6">비밀 정보</Typography>
                  {result.matches &&
                    result.matches.map((match, idx) => (
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
                  mr: "auto",
                  ml: "auto",
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                }}
              >
                초대 URL 복사
              </Button>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="outlined"
          onClick={handleToMain}
          sx={{
            mt: 2,
            mr: "auto",
            ml: "auto",
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
