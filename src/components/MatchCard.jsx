import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { shareOrCopy } from "../utils/share";

const MatchCard = ({
  match,
  groupName,
  leaderName,
  groupId,
  sentStatus,
  updateSentStatus,
  onNotify,
}) => {
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      onNotify?.("카카오톡 공유를 사용할 수 없습니다. 직접 공유를 이용해주세요.", "warning");
      return;
    }
    try {
      // Kakao.Link는 deprecated — 신규 SDK의 Kakao.Share를 우선 사용
      const shareApi = window.Kakao.Share ?? window.Kakao.Link;
      shareApi.sendDefault({
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
      onNotify?.(`${match.giver}님에게 카톡 공유 완료!`, "success");
      updateSentStatus(match.giver); // 공유 완료 상태 업데이트
    } catch (error) {
      // 팝업 차단·파라미터 오류 등으로 공유 창이 열리지 못한 경우
      console.error("카카오톡 공유 실패:", error);
      onNotify?.("카카오톡 공유에 실패했습니다. 직접 공유를 이용해주세요.", "error");
    }
  };

  const handleCopyMatch = async () => {
    const message =
      `"${match.giver}"님의 비밀번호는 "${match.password}" 입니다! 🎁\n` +
      `${leaderName}님이 만든 ${groupName} 결과를 확인하고 준비하세요!\n` +
      `결과 확인 링크: https://manittomaker.com/showResult/${groupId}`;
    try {
      const outcome = await shareOrCopy(message);
      if (outcome === "cancelled") return; // 공유 시트를 닫은 경우 — 완료 처리하지 않음
      if (outcome === "copied") {
        onNotify?.(`${match.giver}님의 결과가 클립보드에 복사되었습니다!`, "success");
      }
      updateSentStatus(match.giver); // 공유 완료 상태 업데이트
    } catch (error) {
      console.error("공유 실패:", error);
      onNotify?.("공유에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <Card raised sx={{ width: "100%", maxWidth: 500 }}>
      <CardContent>
        <Typography variant="h6" color="#e0f2f1" gutterBottom>
          {match.giver}
        </Typography>
        <Typography variant="body1" color="#ffc1cf">
          비밀번호: {match.password}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          mt={1.5}
          justifyContent="center"
          alignItems="stretch"
        >
          <Button
            variant="contained"
            onClick={handleKakaoShare}
            sx={{ bgcolor: "#ffc107", "&:hover": { bgcolor: "#ffb300" } }}
          >
            <img
              src={"/talkkakao.png"}
              alt=""
              style={{
                width: "24px",
                maxHeight: "24px",
                objectFit: "cover",
              }}
            />
            <Box sx={{ ml: 1, color: "black" }}>개별 카톡 공유</Box>
          </Button>

          <Button
            variant="outlined"
            onClick={handleCopyMatch}
            sx={{
              color: "primary.light",
              borderColor: "primary.light",
              ":hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(255, 133, 162, 0.08)",
              },
            }}
          >
            <img
              src="/share_link_pink.png"
              alt=""
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
          <Typography variant="body2" sx={{ color: "success.main", marginTop: "8px" }}>
            ✅ 결과 공유 완료!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
