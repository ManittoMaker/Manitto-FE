import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Container, Button, Stack } from "@mui/material";
import GoogleAd from "../components/GoogleAdComponent";
import MatchCard from "../components/MatchCard";
import StepIndicator from "../components/StepIndicator";
import AppSnackbar from "../components/AppSnackbar";
import useSnackbar from "../hooks/useSnackbar";
import { shareOrCopy } from "../utils/share";
import useGroupStore from "../store/groupStore";

const FinalResultPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  // 공유 완료 상태는 store에 persist — 새로고침해도 체크 표시 유지
  const { groupName, leaderName, groupPassword, matches, sentStatusByGroup, markSent } =
    useGroupStore();
  const sentStatus = sentStatusByGroup[groupId] ?? {};
  const { showSnackbar, snackbarProps } = useSnackbar();

  const handleShareURL = async () => {
    const url = `${window.location.origin}/showResult/${groupId}`;
    try {
      const outcome = await shareOrCopy(url);
      if (outcome === "copied") {
        showSnackbar("URL이 클립보드에 복사되었습니다!", "success");
      }
    } catch (error) {
      console.error("공유 실패:", error);
      showSnackbar("공유에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleToMain = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <StepIndicator activeStep={2} />
      <Box sx={{ textAlign: "center", marginTop: 2, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
          🎉 최종 매칭 결과 🎉
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          각 참가자에게 <strong>비밀번호</strong>를 전달해주세요.
          <br />
          참가자는 결과 링크에서 이름과 비밀번호로 자기 마니또를 확인해요.
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
              updateSentStatus={(giver) => markSent(groupId, giver)}
              onNotify={showSnackbar}
            />
          ))}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            sx={{
              width: 180,
              backgroundColor: "primary.light",
              "&:hover": { backgroundColor: "primary.main" },
            }}
            onClick={handleShareURL}
          >
            URL 공유하기
          </Button>

          <Button
            variant="outlined"
            onClick={handleToMain}
            sx={{
              width: 180,
              color: "primary.dark",
              borderColor: "primary.dark",
              "&:hover": { backgroundColor: "rgba(216, 27, 96, 0.08)" },
            }}
          >
            메인으로
          </Button>
        </Stack>

        {/* 리더가 나중에 전체 결과를 다시 조회할 때 쓰는 마스터(그룹) 비밀번호 */}
        {groupPassword && (
          <Box
            sx={{
              mt: 3,
              mx: "auto",
              maxWidth: 500,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              border: "1px dashed",
              borderColor: "secondary.dark",
              backgroundColor: "rgba(255, 210, 229, 0.06)",
            }}
          >
            <Typography variant="body2">
              🔑 리더용 마스터 비밀번호:{" "}
              <Box
                component="strong"
                sx={{ color: "secondary.main", fontSize: "1.1rem" }}
              >
                {groupPassword}
              </Box>
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              &quot;기존 마니또 결과 확인하기&quot;에서 리더 이름 · 그룹 이름과 함께 입력하면
              <br />
              언제든 전체 결과를 다시 볼 수 있어요. 꼭 저장해두세요!
            </Typography>
          </Box>
        )}

        <GoogleAd />

        <AppSnackbar {...snackbarProps} />
      </Box>
    </Container>
  );
};

export default FinalResultPage;
