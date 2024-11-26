import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import fetchMatchesFromFirestore from "../firebase/fetchMatches";
import getGroupDetailsFromFirestore from "../firebase/getGroupName";
import Confetti from "react-confetti";

const ShowPage = () => {
  const { groupId } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const details = await getGroupDetailsFromFirestore(groupId);
      setGroupName(details.groupName);
    };
    fetchGroupDetails();
  }, [groupId]);

  const handleSubmit = async () => {
    try {
      const allMatches = await fetchMatchesFromFirestore(groupId);
      const match = allMatches[0]?.matches.find(
        (doc) => doc.giver === name.trim() && doc.password === password.trim()
      );

      if (match) {
        setResult(match);
        setConfettiActive(true); // 결과 확인 시 Confetti 활성화
      } else {
        alert("이름 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("결과 확인 실패:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        {confettiActive && <Confetti />}
        <Typography sx={{ marginBottom: 1, color: "#b2dfdb" }}>
          🎁 {groupName} 🎁
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          매칭 결과 확인
        </Typography>
        <TextField
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          결과 확인
        </Button>
        {result && (
          <Typography sx={{ marginTop: 4 }} color="primary">
            <Typography
              component="span"
              color="secondary"
              sx={{ marginRight: 0.5 }}
            >
              {result.giver}
            </Typography>
            님의 마니또는
            <Typography
              component="span"
              color="secondary"
              sx={{ marginLeft: 0.5 }}
            >
              {result.receiver}
            </Typography>
            입니다!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ShowPage;
