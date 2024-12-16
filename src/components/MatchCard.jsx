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
          imageUrl: "https://manittomaker.com/Landing.png",
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
    } else {
      alert("Kakao SDK가 초기화되지 않았습니다.");
    }
  };

  // 결과 복사
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
    });
  };

  return (
    <Card raised sx={{ minWidth: 275, width: "100%", maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h6" color="#e0f2f1" gutterBottom>
          {match.giver}
        </Typography>
        <Typography variant="body1" color="#80cbc4">
          비밀번호: {match.password}
        </Typography>

        <Stack direction="row" spacing={2} mt={1} justifyContent="center">
          {/* 카카오톡 공유 버튼 */}
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
            <Box sx={{ ml: 1, color: "black" }}>결과 카톡 공유</Box>
          </Button>

          {/* 결과 복사 버튼 */}
          <Button
            variant="outlined"
            onClick={handleCopyMatch}
            sx={{
              color: "#80cbc4",
              borderColor: "#80cbc4",
              ":hover": {
                borderColor: "#80cbc4",
                backgroundColor: "#e0f2f1",
              },
            }}
          >
            <img
              src="/share_link.png"
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
      </CardContent>
    </Card>
  );
};

export default MatchCard;
