import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchMatchesFromFirestore from "../firebase/fetchMatches";
import getGroupDetailsFromFirestore from "../firebase/getGroupName";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleAd from "../components/GoogleAdComponent";
import MatchCard from "../components/MatchCard"; // 분리된 MatchCard 컴포넌트

const FinalResultPage = () => {
  const { groupId } = useParams();
  const [matches, setMatches] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 메시지 상태 추가
  const [groupName, setGroupName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const navigate = useNavigate();

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatchesFromFirestore(groupId);
      setMatches(results[0]?.matches || []);
    };

    const fetchGroupDetails = async () => {
      const details = await getGroupDetailsFromFirestore(groupId);
      setGroupName(details.groupName);
      setLeaderName(details.leaderName);
    };

    fetchData();
    fetchGroupDetails();
  }, [groupId]);

  // URL 복사 처리
  const handleCopyURL = () => {
    const url = `${window.location.origin}/showResult/${groupId}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setSnackbarMessage("URL이 클립보드에 복사되었습니다!");
        setOpenSnackbar(true);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

  // Snackbar 닫기
  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // 메인으로 이동
  const handleToMain = () => {
    navigate("/");
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          🎉 최종 매칭 결과 🎉
        </Typography>

        <Stack spacing={2} alignItems="center">
          {matches.map((match) => (
            <MatchCard
              key={match.giver} // 고유 키 사용
              match={match}
              groupName={groupName}
              leaderName={leaderName}
              groupId={groupId}
              setSnackbarMessage={setSnackbarMessage} // Snackbar 메시지 설정
              setOpenSnackbar={setOpenSnackbar} // Snackbar 열기
            />
          ))}
        </Stack>

        {/* URL 공유 버튼 */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleCopyURL}
          sx={{ mt: 2, width: "120px" }}
        >
          URL 공유하기
        </Button>

        {/* 메인으로 이동 버튼 */}
        <Button
          variant="outlined"
          color="teal"
          onClick={handleToMain}
          sx={{
            color: "teal",
            mt: 2,
            width: "120px",
          }}
        >
          메인으로
        </Button>

        <GoogleAd />

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default FinalResultPage;
