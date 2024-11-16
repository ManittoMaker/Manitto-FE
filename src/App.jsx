import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import Snowfall from "react-snowfall";
import NameInput from "./components/NameInput";
import { getRandomAnimal } from "./utils/password";
import saveMatchesToFirestore from "./firebase/saveMatches";

const App = () => {
  const [names, setNames] = useState([]);
  const [matches, setMatches] = useState([]);

  const handleStartMatching = async () => {
    if (names.length < 2) {
      alert("최소 2명 이상의 이름을 입력해주세요.");
      return;
    }

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const result = shuffled.map((name, index) => ({
      giver: name,
      receiver: shuffled[(index + 1) % shuffled.length],
      password: getRandomAnimal(),
    }));

    try {
      await saveMatchesToFirestore(result);
      setMatches(result);
    } catch (error) {
      console.error("Error saving matches to Firestore:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Snowfall color="white" snowflakeCount={100} />
      <Container maxWidth="sm" sx={{ textAlign: "center", color: "white" }}>
        <Typography variant="h3" sx={{ marginBottom: 3 }}>
          🎄 마니또 🎅
        </Typography>
        <Card
          sx={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          <CardContent>
            <NameInput names={names} setNames={setNames} />
            <Button
              variant="contained"
              color="secondary"
              sx={{
                marginTop: 2,
                backgroundColor: "green",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              onClick={handleStartMatching}
              disabled={names.length < 2}
            >
              매칭 시작
            </Button>
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5">비밀번호 확인</Typography>
            <ul>
              {matches.map((match, index) => (
                <li
                  key={index}
                  style={{ listStyleType: "none", margin: "8px 0" }}
                >
                  🎁 <strong>{match.giver}</strong> → 비밀번호:{" "}
                  <strong>{match.password}</strong>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default App;
