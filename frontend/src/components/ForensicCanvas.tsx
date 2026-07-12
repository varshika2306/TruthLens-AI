import { useEffect, useRef, useState } from "react";

export default function ForensicCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: width || 400,
          height: height || 400,
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const { width, height } = dimensions;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Particles/Nodes for the mesh
    const nodeCount = 35;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseDir: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1,
        pulse: Math.random(),
        pulseDir: Math.random() > 0.5 ? 0.01 : -0.01,
      });
    }

    let scanLineY = 0;
    let scanDirection = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background coordinate grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.04)"; // very faint cyan
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw outer scan circles/targets (forensic HUD)
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(168, 85, 247, 0.05)"; // purple accent ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // HUD crosshairs
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY);
      ctx.lineTo(centerX + 15, centerY);
      ctx.moveTo(centerX, centerY - 15);
      ctx.lineTo(centerX, centerY + 15);
      ctx.stroke();

      // 3. Update and draw nodes (AI mesh)
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulse size
        node.pulse += node.pulseDir;
        if (node.pulse > 1.2 || node.pulse < 0.6) {
          node.pulseDir *= -1;
        }

        // Draw node
        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + node.pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * node.pulse, 0, Math.PI * 2);
        ctx.fill();

        // Subtle core point
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw connection lines (network)
      ctx.lineWidth = 0.8;
      const maxDistance = 110;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 5. Draw the Sweeping Digital Scan Line
      scanLineY += 1 * scanDirection;
      if (scanLineY > height) {
        scanLineY = height;
        scanDirection = -1;
      } else if (scanLineY < 0) {
        scanLineY = 0;
        scanDirection = 1;
      }

      // Scanner gradient sweep
      const scanGrad = ctx.createLinearGradient(0, scanLineY - 30 * scanDirection, 0, scanLineY);
      if (scanDirection === 1) {
        scanGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
        scanGrad.addColorStop(0.8, "rgba(6, 182, 212, 0.08)");
        scanGrad.addColorStop(1, "rgba(6, 182, 212, 0.35)");
      } else {
        scanGrad.addColorStop(0, "rgba(6, 182, 212, 0.35)");
        scanGrad.addColorStop(0.2, "rgba(6, 182, 212, 0.08)");
        scanGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
      }

      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanDirection === 1 ? scanLineY - 30 : scanLineY, width, 30);

      // Hard scanner core line
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      // Dynamic text elements near scanner line
      ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
      ctx.font = "8px monospace";
      ctx.fillText(`SYS.SCAN_POS: ${Math.round(scanLineY)}px`, 15, scanLineY - 6);
      ctx.fillText(`FREQ: ${(0.824 + Math.sin(scanLineY / 40) * 0.05).toFixed(3)} GHz`, width - 100, scanLineY - 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-950/20 rounded-xl border border-cyan-500/10">
      <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/60 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        SYSTEM_DIAGNOSTIC_MESH
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-cyan-500/40">
        GRANITE_COGNITIVE_GRID // v2.6
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
