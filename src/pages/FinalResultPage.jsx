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
import MatchCard from "../components/MatchCard";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FinalResultPage = () => {
  const { groupId } = useParams();
  const [matches, setMatches] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [sentStatus, setSentStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatchesFromFirestore(groupId);
      const fetchedMatches = results[0]?.matches || [];
      const shuffledMatches = shuffleArray(fetchedMatches);
      setMatches(shuffledMatches);
    };

    const fetchGroupDetails = async () => {
      const details = await getGroupDetailsFromFirestore(groupId);
      setGroupName(details.groupName);
      setLeaderName(details.leaderName);
    };

    fetchData();
    fetchGroupDetails();
  }, [groupId]);

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

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleToMain = () => {
    navigate("/");
  };

  const updateSentStatus = (giver) => {
    setSentStatus((prev) => ({ ...prev, [giver]: true }));
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
              key={match.giver}
              match={match}
              groupName={groupName}
              leaderName={leaderName}
              groupId={groupId}
              sentStatus={sentStatus[match.giver]}
              updateSentStatus={updateSentStatus}
              setSnackbarMessage={setSnackbarMessage}
              setOpenSnackbar={setOpenSnackbar}
            />
          ))}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCopyURL}
          sx={{ mt: 2, width: "120px" }}
        >
          URL 공유하기
        </Button>

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
