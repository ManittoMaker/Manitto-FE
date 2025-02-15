import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";

const MatchCard = ({
  match,
  groupName,
  leaderName,
  groupId,
  sentStatus,
  updateSentStatus,
  setSnackbarMessage,
  setOpenSnackbar,
}) => {
  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `"${match.giver}"님의 비밀번호는 "${match.password}" 입니다! 🎁`,
          description: `${leaderName}님이 만든 ${groupName} 결과를 확인하고 준비하세요!`,
          imageUrl: "https://manittomaker.com/dog_white.JPG",
          link: {
            mobileWebUrl: `https://manittomaker.com/showResult/${groupId}`,
            webUrl: `https://manittomaker.com/showResult/${groupId}`,
          },
        },
        buttons: [
          {
            title: "결과 보기",
            link: {
              mobileWebUrl: `https://manittomaker.com/showResult/${groupId}`,
              webUrl: `https://manittomaker.com/showResult/${groupId}`,
            },
          },
        ],
      });
      setSnackbarMessage(`${match.giver}님에게 카톡 공유 완료!`);
      setOpenSnackbar(true);
      updateSentStatus(match.giver); // 공유 완료 상태 업데이트
    } else {
      alert("Kakao SDK가 초기화되지 않았습니다.");
    }
  };

  const handleCopyMatch = () => {
    const message =
      `"${match.giver}"님의 비밀번호는 "${match.password}" 입니다! 🎁\n` +
      `${leaderName}님이 만든 ${groupName} 결과를 확인하고 준비하세요!\n` +
      `결과 확인 링크: https://manittomaker.com/showResult/${groupId}`;
    navigator.clipboard.writeText(message).then(() => {
      setSnackbarMessage(
        `${match.giver}님의 결과가 클립보드에 복사되었습니다!`
      );
      setOpenSnackbar(true);
      updateSentStatus(match.giver); // 공유 완료 상태 업데이트
    });
  };

  return (
    <Card raised sx={{ minWidth: 275, width: "100%", maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h6" color="#e0f2f1" gutterBottom>
          {match.giver}
        </Typography>
        <Typography variant="body1" color="#ffc1cf">
          비밀번호: {match.password}
        </Typography>

        <Stack direction="row" spacing={2} mt={1} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleKakaoShare}
            sx={{ bgcolor: "#ffc107" }}
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
            <Box sx={{ ml: 1, color: "black" }}>개별 카톡 공유</Box>
          </Button>

          <Button
            variant="outlined"
            onClick={handleCopyMatch}
            sx={{
              color: "#FF85A2",
              borderColor: "#FF85A2",
              ":hover": {
                borderColor: "#FF85A2",
                backgroundColor: "#fef3f5",
              },
            }}
          >
            <img
              src="/share_link_pink.png"
              alt="공유"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
              }}
            />
            결과 직접 공유
          </Button>
        </Stack>

        {sentStatus && (
          <Typography variant="body2" sx={{ color: "green", marginTop: "8px" }}>
            ✅ 결과 공유 완료!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
