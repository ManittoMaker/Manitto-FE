import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import GroupInfoModal from "../components/GroupInfoModal";
import StepIndicator from "../components/StepIndicator";
import AppSnackbar from "../components/AppSnackbar";
import useSnackbar from "../hooks/useSnackbar";
import { submitNames } from "../api/createMatch";
import { shareOrCopy } from "../utils/share";
import useGroupStore from "../store/groupStore";

const InputNamesPage = () => {
  const { groupId } = useParams();
  const [names, setNames] = useState([]);
  const [inputName, setInputName] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { showSnackbar, snackbarProps } = useSnackbar();
  const navigate = useNavigate();

  const { groupName, leaderName, groupPassword } = useGroupStore();

  // 추가/수정 후 입력창에 포커스를 되돌려 연속 입력이 끊기지 않게 함
  const refocusInput = () => inputRef.current?.focus();

  const addName = () => {
    const trimmedName = inputName.trim();
    if (!trimmedName) return;

    if (names.includes(trimmedName)) {
      showSnackbar("동일한 이름이 이미 존재합니다.", "warning");
      return;
    }
    setNames((prevNames) => [...prevNames, trimmedName]);
    setInputName("");
    refocusInput();
  };

  const updateName = () => {
    if (selectedName === null) return;

    const trimmedName = inputName.trim();
    if (!trimmedName) return;

    // 다른 항목과 중복되는 이름으로는 수정 불가
    if (names.some((name, i) => i !== selectedName && name === trimmedName)) {
      showSnackbar("동일한 이름이 이미 존재합니다.", "warning");
      return;
    }

    const updatedNames = [...names];
    updatedNames[selectedName] = trimmedName;
    setNames(updatedNames);
    setInputName("");
    setSelectedName(null);
    refocusInput();
  };

  const handleKeyDown = (event) => {
    // 한글 IME 조합 중 Enter는 무시 (조합 확정 Enter가 중복 입력되는 것 방지)
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (selectedName !== null) {
        updateName();
      } else {
        addName();
      }
    }
  };

  const handleDelete = (index) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
    if (selectedName === index) {
      // 수정 중이던 항목이 삭제되면 수정 모드 해제
      setSelectedName(null);
      setInputName("");
    } else if (selectedName !== null && index < selectedName) {
      // 앞쪽 항목이 삭제되면 배열이 당겨지므로 수정 대상 인덱스 보정
      setSelectedName(selectedName - 1);
    }
  };

  const handleEdit = (index) => {
    setInputName(names[index]);
    setSelectedName(index);
    refocusInput();
  };

  const handleStartMatching = () => {
    if (names.length < 2) {
      showSnackbar("최소 2명 이상의 이름을 입력해주세요.", "warning");
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitNames = async () => {
    if (names.length < 2) {
      showSnackbar("최소 2명 이상의 이름을 입력해주세요.", "warning");
      return;
    }

    setIsSubmitting(true); // 매칭은 되돌릴 수 없으므로 중복 요청 방지가 특히 중요
    try {
      const result = await submitNames(groupId, names);

      // 성공 응답이라도 result가 비어 있으면 빈 결과 화면으로 넘어가지 않도록 방어
      if (!result?.result) {
        showSnackbar("매칭 결과를 받아오지 못했습니다. 다시 시도해주세요.", "error");
        setIsSubmitting(false);
        return;
      }

      useGroupStore.getState().setMatches(result.result);
      navigate(`/finalResult/${groupId}`);
    } catch (error) {
      console.error("❌ 매칭 오류:", error);

      let userMessage = "매칭에 실패했습니다. 다시 시도해주세요.";

      switch (error.code) {
        case -304:
          userMessage = "이미 매칭이 완료된 그룹입니다. 결과 페이지를 확인해주세요.";
          break;
        case -303:
          userMessage = "멤버 이름은 중복될 수 없습니다. 중복된 이름을 제거해주세요.";
          break;
        case -102:
          userMessage = "올바르지 않은 입력값입니다. 이름을 다시 확인해주세요.";
          break;
        case -100:
          userMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          break;
      }

      showSnackbar(userMessage, "error");
      setIsSubmitting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const text = `${leaderName}님!!\n이 그룹의 이름은 "${groupName}"이고 비밀번호는 "${groupPassword}"입니다! 저장하고 가세요!`;
    try {
      const outcome = await shareOrCopy(text);
      if (outcome === "copied") {
        showSnackbar("클립보드에 복사되었습니다!", "success");
      }
    } catch (error) {
      console.error("복사 실패:", error);
      showSnackbar("복사에 실패했습니다. 화면을 캡처해주세요.", "error");
    }
  };

  return (
    <Container maxWidth="sm">
      <StepIndicator activeStep={1} />
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
        >
          안녕하세요, 반갑습니다 :)
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Box component="span" sx={{ color: "secondary.dark", fontWeight: "bold" }}>
            {groupName}
          </Box>
          의{" "}
          <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
            {leaderName}
          </Box>
          님!!!
        </Typography>
        <Typography gutterBottom>
          이 그룹의 비밀번호는 &quot;
          <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
            {groupPassword}
          </Box>
          &quot;입니다.
        </Typography>
        <Typography component="span" sx={{ marginBottom: 2 }}>
          결과를 확인할 때 필요합니다.
        </Typography>
        <Box component="span" sx={{ color: "secondary.main", ml: 1 }}>
          캡처 추천!
        </Box>
        <Box sx={{ mt: 1 }}>
          마니또에 참여할 참가자 이름을 모두 기입해주세요.
        </Box>

        <TextField
          label="이름"
          placeholder="참가자 이름 입력 후 Enter"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          fullWidth
          autoComplete="off"
          sx={{ marginBottom: 2, mt: 2 }}
        />

        {selectedName !== null ? (
          <Button
            variant="contained"
            color="primary"
            onClick={updateName}
            sx={{ marginBottom: 2 }}
          >
            이름 수정
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={addName}
            sx={{ marginBottom: 2, color: "primary.main" }}
          >
            이름 추가
          </Button>
        )}

        {names.length === 0 ? (
          // 빈 상태 안내 — 무엇을 해야 하는지, 리더 본인 포함 여부를 알려줌
          <Box
            sx={{
              py: 3,
              px: 2,
              borderRadius: 2,
              border: "1px dashed rgba(255, 210, 229, 0.35)",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              아직 참가자가 없어요.
              <br />
              마니또에 참여할 모든 사람의 이름을 추가해주세요.
              <br />
              <Box component="span" sx={{ color: "secondary.main" }}>
                리더 본인도 잊지 마세요!
              </Box>
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "right" }}>
              참가자 {names.length}명
            </Typography>
            <List>
              {names.map((name, index) => (
                <ListItem
                  key={name}
                  divider
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label={`${name} 이름 수정`}
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label={`${name} 이름 삭제`}
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleStartMatching}
          disabled={names.length < 2}
        >
          매칭 시작
        </Button>
        {names.length < 2 && (
          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
            2명 이상 추가하면 매칭을 시작할 수 있어요.
          </Typography>
        )}

        <AppSnackbar {...snackbarProps} />

        <GroupInfoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          leaderName={leaderName}
          groupName={groupName}
          groupPassword={groupPassword}
          onCopy={handleCopyToClipboard}
          onConfirm={handleSubmitNames}
          isSubmitting={isSubmitting}
          onNotify={showSnackbar}
        />
      </Box>
    </Container>
  );
};

export default InputNamesPage;
