import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Snowfall from "react-snowfall";
import fetchMatchesFromFirestore from "../firebase/fetchMatches";

const ShowPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const allMatches = await fetchMatchesFromFirestore();

      const match = allMatches[0].matches.find(
        (doc) => doc.giver === name.trim() && doc.password === password.trim()
      );

      if (match) {
        console.log("Match Found:", match);
        setResult(match);
      } else {
        alert("이름 또는 비밀번호가 잘못되었습니다.");
        setResult(null);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      alert("매칭 결과를 불러오는 중 오류가 발생했습니다.");
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
      <Snowfall color="white" snowflakeCount={80} />
      <Card
        sx={{
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: 3,
          borderRadius: 2,
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            🔍 마니또 확인 🎄
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              label="이름"
              sx={{
                marginBottom: 2,
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호(동물 이름)"
              label="비밀번호"
              sx={{
                marginBottom: 2,
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              마니또 확인
            </Button>
          </form>

          {result && (
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6">🎉 결과 🎉</Typography>
              <Typography>
                <strong>{result.giver}</strong>님의 마니또는{" "}
                <strong>{result.receiver}</strong>입니다!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShowPage;
