import { useEffect } from "react";

const MatchResults = ({ matches, onReset }) => {
  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  return (
    <div>
      <h2>매칭 결과</h2>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>
            {match.giver} → {match.receiver} (비밀번호: {match.password})
          </li>
        ))}
      </ul>
      <button onClick={onReset}>다시 시작</button>
    </div>
  );
};

export default MatchResults;
