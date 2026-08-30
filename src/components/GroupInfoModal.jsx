import { Box, Typography, Button, Modal, Stack, CircularProgress } from "@mui/material";

const GroupInfoModal = ({
  open,
  onClose,
  leaderName,
  groupName,
  groupPassword,
  onCopy,
  onConfirm,
  isSubmitting = false,
  onNotify,
}) => {
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      onNotify?.("카카오톡 공유를 사용할 수 없습니다. 복사하기를 이용해주세요.", "warning");
      return;
    }
    try {
      // Kakao.Link는 deprecated — 신규 SDK의 Kakao.Share를 우선 사용
      const shareApi = window.Kakao.Share ?? window.Kakao.Link;
      shareApi.sendDefault({
        objectType: "feed",
        content: {
          title: `📢 ${leaderName}님이 만든 그룹 "${groupName}"의 비밀번호! 🔑`,
          description: `비밀번호는 "${groupPassword}"입니다.\n매칭 후 결과를 확인해보세요!`,
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
    } catch (error) {
      // 팝업 차단·파라미터 오류 등으로 공유 창이 열리지 못한 경우
      console.error("카카오톡 공유 실패:", error);
      onNotify?.("카카오톡 공유에 실패했습니다. 복사하기를 이용해주세요.", "error");
    }
  };

  return (
    <Modal open={open} onClose={isSubmitting ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: { xs: 3, sm: 4 },
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          textAlign: "center",
          // 좁은 화면에서는 좌우 16px 여백을 남기고 꽉 차게
          width: { xs: "calc(100% - 32px)", sm: 420 },
          boxSizing: "border-box",
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
            mb: 2,
          }}
        >
          이 그룹의 이름은{" "}
          <strong style={{ color: "#FF85A2" }}>{groupName}</strong>이고
          <br />
          비밀번호는{" "}
          <strong style={{ color: "#FF85A2" }}>{groupPassword}</strong>입니다.
        </Typography>

        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              maxWidth: 140,
              color: "#D81B60",
              borderColor: "#D81B60",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#FFEAF0", borderColor: "#D81B60" },
            }}
            onClick={onCopy}
          >
            복사하기
          </Button>

          <Button
            variant="contained"
            sx={{
              flex: 1,
              maxWidth: 140,
              backgroundColor: "#FFD700",
              color: "black",
              "&:hover": { backgroundColor: "#FFC107" },
              whiteSpace: "nowrap",
            }}
            onClick={handleKakaoShare}
          >
            <img
              src="/talkkakao.png"
              alt=""
              style={{ width: "20px", height: "20px", marginRight: "6px" }}
            />
            카톡공유
          </Button>
        </Stack>

        {/* 매칭은 되돌릴 수 없다는 사실을 실행 직전에 명확히 안내 */}
        <Typography variant="body2" sx={{ color: "#B26500", mb: 1.5 }}>
          ⚠️ 매칭 후에는 참가자를 추가하거나 수정할 수 없어요.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            height: 44,
            backgroundColor: "#ED4264",
            fontWeight: "bold",
            color: "white",
            "&:hover": { backgroundColor: "#FF85A2" },
          }}
          onClick={onConfirm}
        >
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "매칭 진행"
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default GroupInfoModal;
