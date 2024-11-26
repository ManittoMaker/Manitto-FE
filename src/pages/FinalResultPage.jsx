import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchMatchesFromFirestore from "../firebase/fetchMatches";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import getGroupDetailsFromFirestore from "../firebase/getGroupName";
import { useNavigate } from "react-router-dom";

const FinalResultPage = () => {
  const { groupId } = useParams();
  const [matches, setMatches] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatchesFromFirestore(groupId);
      setMatches(results[0]?.matches || []);
    };
    fetchData();
    const fetchGroupDetails = async () => {
      const details = await getGroupDetailsFromFirestore(groupId);
      setGroupName(details.groupName);
      setLeaderName(details.leaderName);
    };
    fetchGroupDetails();
  }, [groupId]);

  const handleCopyURL = () => {
    const url = `${window.location.origin}/showResult/${groupId}`;
    navigator.clipboard.writeText(url).then(
      () => setOpenSnackbar(true),
      (err) => console.error("Failed to copy: ", err)
    );
  };

  const handleKakaoShare = (match) => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `${leaderName}님이 생성한 ✨${groupName}✨ 마니또 뽑기 결과가 나왔어요!`,
          description: `${match.giver}님의 마니또 비밀번호는 "${match.password}" 입니다! 지금 이름과 비밀번호를 입력해서 바로 확인하고, 선물을 준비하세요! 🎁`,
          imageUrl: "https://i.ibb.co/QbHpY2p/Landing.png",
          link: {
            mobileWebUrl: `https://manitto-73651.web.app/showResult/${groupId}`,
            webUrl: `https://manitto-73651.web.app/showResult/${groupId}`,
          },
        },
        buttons: [
          {
            title: "결과 보기",
            link: {
              mobileWebUrl: `https://manitto-73651.web.app/showResult/${groupId}`,
              webUrl: `https://manitto-73651.web.app/showResult/${groupId}`,
            },
          },
        ],
      });
    } else {
      alert("Kakao SDK가 초기화되지 않았습니다.");
    }
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

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
          {matches.map((match, index) => (
            <Card
              raised
              sx={{ minWidth: 275, width: "100%", maxWidth: 500 }}
              key={index}
            >
              <CardContent>
                <Typography variant="h6" color="#e0f2f1" gutterBottom>
                  {match.giver}
                </Typography>
                <Typography variant="body1" color="#80cbc4">
                  비밀번호: {match.password}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleKakaoShare(match)}
                  sx={{ mt: 1, bgcolor: "#ffc107" }}
                >
                  <img
                    src={"/talkkakao.png"}
                    alt={"카카오톡"}
                    style={{
                      width: "30px",
                      maxHeight: "30px",
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ ml: 1, color: "black" }}>비밀번호 공유</Box>
                </Button>
              </CardContent>
            </Card>
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
            severity="success"
            sx={{ width: "100%" }}
          >
            URL이 클립보드에 복사되었습니다!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default FinalResultPage;
