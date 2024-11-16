import { useEffect, useState } from "react";
import fetchMatchesFromFirestore from "../firebase/fetchMatches";

const FinalResultPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchMatchesFromFirestore();
      setMatches(results);
    };
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎉 최종 마니또 결과 🎁</h1>
      {matches.map((match, index) => (
        <div key={index}>
          <h2>매칭 ID: {match.id}</h2>
          <ul>
            {match.matches.map((item, idx) => (
              <li key={idx}>
                {item.giver} → {item.receiver} (비밀번호: {item.password})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FinalResultPage;
