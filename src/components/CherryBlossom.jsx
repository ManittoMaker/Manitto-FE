import { useEffect, useRef } from "react";

const CherryBlossom = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];
    const totalPetals = 100;
    const windStrength = 1.5;
    const fallSpeed = 3.15; // 초속 5cm = 189px/s → 60FPS 기준 3.15px/frame

    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * fallSpeed + 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1.5 - 0.75;
        this.opacity = Math.random() * 0.7 + 0.3;
      }

      update() {
        this.x += this.speedX + Math.sin(this.y / 90) * windStrength;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
          this.speedX = Math.random() * 1.5 - 0.75;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size, -this.size, this.size, 0);
        ctx.quadraticCurveTo(this.size, this.size, 0, this.size);
        ctx.quadraticCurveTo(-this.size, this.size, -this.size, 0);
        ctx.quadraticCurveTo(-this.size, -this.size, 0, -this.size);
        ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < totalPetals; i++) {
      petals.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

export default CherryBlossom;
