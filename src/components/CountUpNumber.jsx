import { useEffect, useRef, useState } from "react";

// 0부터 목표 숫자까지 차오르는 카운트업 애니메이션
// 초반엔 빠르게, 끝에선 천천히 안착(easeOutExpo)해 "실시간으로 쌓이는" 느낌을 줌
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const CountUpNumber = ({ value, duration = 1800 }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // 모션 최소화 선호 시 애니메이션 없이 최종 값 표시
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * easeOutExpo(progress)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  // 천 단위 콤마 (61593 → 61,593)
  return <>{display.toLocaleString("ko-KR")}</>;
};

export default CountUpNumber;
