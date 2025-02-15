import { Box, Typography, Button, Modal, Grid2 } from "@mui/material";

const GroupInfoModal = ({
  open,
  onClose,
  leaderName,
  groupName,
  groupPassword,
  onCopy,
  onConfirm,
  groupId,
}) => {
  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `📢 ${leaderName}님이 만든 그룹 "${groupName}"의 비밀번호! 🔑`,
          description: `비밀번호는 "${groupPassword}"입니다.\n결과 확인 후 매칭을 준비하세요!`,
          imageUrl: "https://manittomaker.com/dog_white.JPG",
          link: {
            mobileWebUrl: `https://manittomaker.com/checkResults`,
            webUrl: `https://manittomaker.com/checkResults`,
          },
        },
        buttons: [
          {
            title: "결과 보기",
            link: {
              mobileWebUrl: `https://manittomaker.com/checkResults`,
              webUrl: `https://manittomaker.com/checkResults`,
            },
          },
        ],
      });
    } else {
      alert("Kakao SDK가 초기화되지 않았습니다.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          textAlign: "center",
          maxWidth: 420,
          margin: "auto",
          mt: 10,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#D81B60", fontWeight: "bold" }}
        >
          📌 {leaderName}님!
        </Typography>
        <Typography
          sx={{
            color: "#333333",
            fontSize: "1rem",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          이 그룹의 이름은{" "}
          <strong style={{ color: "#FF85A2" }}>{groupName}</strong>이고
          <br />
          비밀번호는{" "}
          <strong style={{ color: "#FF85A2" }}>{groupPassword}</strong>입니다.
        </Typography>

        <Grid2 container spacing={2} justifyContent="center">
          <Grid2 item>
            <Button
              variant="outlined"
              sx={{
                width: "110px",
                height: "40px",
                color: "#D81B60",
                borderColor: "#D81B60",
                textAlign: "center",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#FFEAF0" },
              }}
              onClick={onCopy}
            >
              복사하기
            </Button>
          </Grid2>

          <Grid2 item>
            <Button
              variant="contained"
              sx={{
                width: "110px",
                height: "40px",
                backgroundColor: "#FFD700",
                color: "black",

                textAlign: "center",
                "&:hover": { backgroundColor: "#FFC107" },
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleKakaoShare}
            >
              <img
                src="/talkkakao.png"
                alt="카카오톡"
                style={{
                  width: "20px",
                  height: "20px",

                  marginRight: "6px",
                }}
              />
              카톡공유
            </Button>
          </Grid2>

          <Grid2 item>
            <Button
              variant="contained"
              sx={{
                width: "240px",
                height: "40px",
                backgroundColor: "#ED4264",
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
                "&:hover": { backgroundColor: "#FF85A2" },
              }}
              onClick={onConfirm}
            >
              매칭 진행
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Modal>
  );
};

export default GroupInfoModal;
