import React, { useEffect, useRef } from "react";

const FireworksOverlay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const fireworks = [];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2.5 + 1;
        this.velocity = {
          x: (Math.random() - 0.5) * (Math.random() * 12),
          y: (Math.random() - 0.5) * (Math.random() * 12)
        };
        this.alpha = 1;
        this.friction = 0.96;
        this.gravity = 0.15;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.012;
      }
    }

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.velocity = {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * -12 - 8
        };
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.size = 3;
        this.shouldExplode = false;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.y += this.velocity.y;
        this.x += this.velocity.x;
        this.velocity.y += 0.05; // Gravity on the shell

        if (this.velocity.y >= 0) {
          this.shouldExplode = true;
        }
      }

      explode() {
        const count = 50 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    const loop = () => {
      // Semi-transparent clear creates trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.035) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.shouldExplode) {
          firework.explode();
          fireworks.splice(index, 1);
        }
      });

      particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          particle.update();
          particle.draw();
        }
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
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
        zIndex: 0,
        background: "transparent"
      }}
    />
  );
};

export default FireworksOverlay;
