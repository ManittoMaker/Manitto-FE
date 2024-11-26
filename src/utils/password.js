const endangeredAnimals = [
  "수달",
  "산양",
  "반달가슴곰",
  "삵",
  "저어새",
  "따오기",
  "황새",
  "붉은박쥐",
  "독수리",
  "검은머리갈매기",
  "표범장지뱀",
  "가시고기",
  "긴꼬리딱새",
  "금개구리",
  "두꺼비",
  "붉은배새매",
  "참매",
  "검독수리",
  "양비둘기",
  "검은머리촉새",
  "호사비오리",
  "노랑부리저어새",
  "알락꼬리마도요",
  "흰목물떼새",
  "새홀리기",
  "검은머리딱새",
  "붉은점모시나비",
  "왕은점표범나비",
  "참호박벌",
  "날개띄기민물장어",
  "꼬치동자개",
  "팔색조",
  "따개비고둥",
  "큰주홍부전나비",
  "주름날개멸치",
  "자주방게",
  "장수하늘소",
  "황금박쥐",
  "백조",
  "붉은여우",
  "늑대",
  "마라도딱새",
  "울릉도독도박쥐",
];

const colors = [
  "빨강",
  "하양",
  "파란",
  "검은",
  "주황",
  "노랑",
  "푸른",
  "초록",
  "보라",
  "남색",
  "분홍",
];

export const getRandomAnimal = () => {
  const index = Math.floor(Math.random() * endangeredAnimals.length);
  return endangeredAnimals[index];
};

export const getRandomColorAnimal = () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomAnimal = getRandomAnimal();
  return `${randomColor}${randomAnimal}`;
};
