import { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import addUser from "../firebase/addUser";

const NameInput = ({ names, setNames }) => {
  const [name, setName] = useState("");

  const handleAddName = async () => {
    if (!name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }
    if (names.includes(name)) {
      alert("이미 추가된 이름입니다.");
      return;
    }

    try {
      await addUser(name); // Firestore에 사용자 저장
      setNames([...names, name]);
      setName("");
    } catch (error) {
      console.error("사용자 추가 실패:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddName();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "IM_Hyemin-Bold",
        }}
      >
        🎅 Name 🎁
      </Typography>
      <TextField
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="이름을 입력하세요"
        label="이름"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddName}
        fullWidth
        sx={{
          backgroundColor: "#d32f2f",
          "&:hover": { backgroundColor: "#b71c1c" },
        }}
      >
        추가
      </Button>
      <List
        sx={{
          width: "100%",
          maxHeight: 200,
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 1,
          color: "black",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {names
          .slice()
          .reverse()
          .map((n, index) => (
            <ListItem
              key={index}
              sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
            >
              <ListItemText primary={n} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default NameInput;
