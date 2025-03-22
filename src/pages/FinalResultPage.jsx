import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Container, Button, Stack, Snackbar, Alert } from "@mui/material";
import GoogleAd from "../components/GoogleAdComponent";
import MatchCard from "../components/MatchCard";
import useGroupStore from "../store/groupStore";


const FinalResultPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { groupName, leaderName, matches } = useGroupStore();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sentStatus, setSentStatus] = useState({});

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
        <Typography variant="h5" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
          🎉 최종 매칭 결과 🎉
        </Typography>

        <Stack spacing={2} alignItems="center">
          {matches?.result?.map((match) => (
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
          sx={{
            mt: 2,
            width: "140px",
            backgroundColor: "#FF85A2",
            "&:hover": { backgroundColor: "#FF5C8A" },
          }}
          onClick={handleCopyURL}
        >
          URL 공유하기
        </Button>

        <Button
          variant="outlined"
          onClick={handleToMain}
          sx={{
            ml: 2,
            mt: 2,
            width: "140px",
            color: "#D81B60",
            borderColor: "#D81B60",
            "&:hover": { backgroundColor: "#FFE3E3" },
          }}
        >
          메인으로
        </Button>

        <GoogleAd />

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default FinalResultPage;
