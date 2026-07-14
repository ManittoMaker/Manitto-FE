import { useEffect, useRef } from 'react';

const SnowfallEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // 설정값 (기존 코드의 snowflakeCount=120 반영)
    const snowflakeCount = 120; 
    const snowflakes = [];

    // 1. 캔버스 크기를 화면 전체로 맞춤
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 2. 눈송이 초기화
    const createSnowflakes = () => {
      // 배열 초기화가 필요한 경우 기존 배열 비우기
      snowflakes.length = 0; 
      
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height, // 처음엔 화면 전체에 퍼지게
          radius: Math.random() * 3 + 1,    // 눈송이 크기 (1px ~ 4px)
          speed: Math.random() * 1.5 + 0.5, // 떨어지는 속도
          wind: Math.random() * 0.5 - 0.25  // 좌우 흔들림
        });
      }
    };

    // 3. 애니메이션 그리기 함수
    const render = () => {
      // 화면 지우기
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff'; // 기존 color="#ffffff" 반영
      ctx.beginPath();

      snowflakes.forEach((flake) => {
        // 위치 업데이트
        flake.y += flake.speed;
        flake.x += flake.wind;

        // 화면 바닥을 지나면 다시 위로 올림
        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
        
        // 화면 좌우를 벗어나면 반대편으로 (자연스럽게)
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;

        // 눈송이 그리기
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      });

      ctx.fill();
      animationFrameId = requestAnimationFrame(render);
    };

    // 초기 실행
    handleResize();
    createSnowflakes();
    render();

    // 창 크기 변경 시 대응
    window.addEventListener('resize', handleResize);

    // 컴포넌트 해제 시 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none', // 클릭 통과 (중요)
      }}
    />
  );
};

export default SnowfallEffect;