import React from "react";
import CherryBlossom from "./CherryBlossom";
import SnowfallEffect from "./SnowfallEffect"; // 파일명/대소문자 꼭 확인!

// month: 0=1월 ~ 11=12월
const getSeason = (month) => {
  // 봄: 3~5월 (2,3,4)
  if (month >= 2 && month <= 4) return "spring";

  // 겨울: 11월~2월
  // 11월(10), 12월(11), 1월(0), 2월(1)
  if (month === 10 || month === 11 || month === 0 || month === 1) return "winter";

  return "none";
};

const SeasonalEffect = () => {
  const month = new Date().getMonth();
  const season = getSeason(month);

  if (season === "spring") return <CherryBlossom />;
  if (season === "winter") return <SnowfallEffect />;

  return null; // 그 외 계절엔 효과 없음
};

export default SeasonalEffect;
