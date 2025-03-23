import { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import GroupInfoModal from "../components/GroupInfoModal";
import { submitNames } from "../api/createMatch";
import useGroupStore from "../store/groupStore";

const InputNamesPage = () => {
  const { groupId } = useParams();
  const [names, setNames] = useState([]);
  const [inputName, setInputName] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { groupName, leaderName, groupPassword } = useGroupStore();

  const addName = () => {
    setInputName((currentInput) => {
      const trimmedName = currentInput.trim();
      if (trimmedName) {
        if (names.includes(trimmedName)) {
          setSnackbarMessage("동일한 이름이 이미 존재합니다.");
          setSnackbarOpen(true);
        } else {
          setNames((prevNames) => [...prevNames, trimmedName]);
          setTimeout(() => setInputName(""), 10);
        }
      }
      return "";
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setTimeout(() => {
        if (selectedName !== null) {
          updateName();
        } else {
          addName();
        }
      }, 0);
    }
  };

  const handleDelete = (index) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setInputName(names[index]);
    setSelectedName(index);
  };

  const updateName = () => {
    if (selectedName !== null) {
      const updatedNames = [...names];
      updatedNames[selectedName] = inputName.trim();
      setNames(updatedNames);
      setInputName("");
      setSelectedName(null);
    }
  };

  const handleStartMatching = () => {
    if (names.length < 2) {
      setSnackbarMessage("최소 2명 이상의 이름을 입력해주세요.");
      setSnackbarOpen(true);
      return;
    }
    setModalOpen(true);
  };

const handleSubmitNames = async () => {
  if (names.length < 2) {
    setSnackbarMessage("최소 2명 이상의 이름을 입력해주세요.");
    setSnackbarOpen(true);
    return;
  }

  try {
    const result = await submitNames(groupId, names);
    useGroupStore.getState().setMatches(result.result);

    navigate(`/finalResult/${groupId}`);
  } catch (error) {
    console.error("❌ 매칭 오류:", error);
    setSnackbarMessage("매칭에 실패했습니다. 다시 시도해주세요.");
    setSnackbarOpen(true);
  }
};



  const handleCopyToClipboard = () => {
    const text = `${leaderName}님!!\n이 그룹의 이름은 "${groupName}"이고 비밀번호는 "${groupPassword}"입니다! 저장하고 가세요!`;
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage("클립보드에 복사되었습니다!");
      setSnackbarOpen(true);
    });
  };

  const handleShareKakao = () => {
    const text = `${leaderName}님!!\n이 그룹의 이름은 "${groupName}"이고 비밀번호는 "${groupPassword}"입니다! 저장하고 가세요!`;
    const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(text)}`;
    window.open(kakaoShareUrl, "_blank");
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#ffc4c4", mb: 2 }}
        >
          안녕하세요, 반갑습니다 :)
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Box component="span" sx={{ color: "#ffabd8", fontWeight: "bold" }}>
            {groupName}
          </Box>
          의{" "}
          <Box component="span" sx={{ color: "#ffd2e5", fontWeight: "bold" }}>
            {leaderName}
          </Box>
          님!!!
        </Typography>
        <Typography gutterBottom>
          이 그룹의 비밀번호는 &quot;
          <Box component="span" sx={{ color: "#ffd2e5", fontWeight: "bold" }}>
            {groupPassword}
          </Box>
          &quot;입니다.
        </Typography>
        <Typography component="span" sx={{ marginBottom: 2 }}>
          결과를 확인할 때 필요합니다.
        </Typography>
        <Box component="span" sx={{ color: "#ffd2e5", ml: 1 }}>
          캡처 추천!
        </Box>
        <Box sx={{ mt: 1 }}>
          투표에 참여할 참가자 이름을 모두 기입해주세요.
        </Box>

        <TextField
          label="이름"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
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
            sx={{ marginBottom: 2, color: "#ED4264" }}
          >
            이름 추가
          </Button>
        )}

        <List>
          {names.map((name, index) => (
            <ListItem
              key={index}
              divider
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleStartMatching}
          disabled={names.length < 2}
        >
          매칭 시작
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar>

        <GroupInfoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          leaderName={leaderName}
          groupName={groupName}
          groupPassword={groupPassword}
          onCopy={handleCopyToClipboard}
          onShare={handleShareKakao}
          onConfirm={handleSubmitNames}
        />
      </Box>
    </Container>
  );
};

export default InputNamesPage;
