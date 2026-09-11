// aurora-effect.js - Realistic flowing aurora borealis around phone
(function(){
  const wrapper = document.getElementById('phone3d');
  const canvas = document.getElementById('auroraCanvas');
  if (!wrapper || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w, h;
  
  function resize(){
    w = canvas.width = 400;
    h = canvas.height = 300;
  }
  resize();
  
  const time = { value: 0 };
  
  // Aurora ribbon class
  class AuroraRibbon {
    constructor(config) {
      this.yBase = config.yBase || 0;
      this.amplitude = config.amplitude || 60;
      this.frequency = config.frequency || 0.008;
      this.speed = config.speed || 0.0008;
      this.phase = config.phase || 0;
      this.width = config.width || 80;
      this.color1 = config.color1 || { r: 0, g: 255, b: 128 };
      this.color2 = config.color2 || { r: 0, g: 200, b: 255 };
      this.opacity = config.opacity || 0.3;
      this.noiseOffset = config.noiseOffset || 0;
    }
    
    draw(ctx, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      const segments = 60;
      const segH = h / segments;
      
      for (let layer = 0; layer < 3; layer++) {
        const layerOpacity = this.opacity * (1 - layer * 0.3);
        const layerWidth = this.width * (1 + layer * 0.4);
        const layerOffset = layer * 8;
        
        ctx.beginPath();
        
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const y = i * segH;
          const normalizedY = y / h;
          
          // Multiple sine waves for organic movement
          const wave1 = Math.sin(y * this.frequency + t * this.speed * 1000 + this.phase) * this.amplitude;
          const wave2 = Math.sin(y * this.frequency * 1.7 + t * this.speed * 700 + this.phase * 1.3) * this.amplitude * 0.5;
          const wave3 = Math.sin(y * this.frequency * 0.5 + t * this.speed * 1200 + this.phase * 0.7) * this.amplitude * 0.3;
          
          // Noise-like variation
          const noise = Math.sin(y * 0.02 + t * 0.0003 + this.noiseOffset) * 15;
          
          const x = w / 2 + wave1 + wave2 + wave3 + noise + layerOffset;
          
          // Width varies along the ribbon
          const widthMod = Math.sin(normalizedY * Math.PI) * (1 + Math.sin(t * 0.001 + this.phase) * 0.3);
          const currentWidth = layerWidth * widthMod;
          
          points.push({ x, y, width: currentWidth });
        }
        
        // Draw ribbon as filled shape
        // Right side
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const xOff = p.width / 2;
          if (i === 0) ctx.moveTo(p.x + xOff, p.y);
          else ctx.lineTo(p.x + xOff, p.y);
        }
        // Left side (reverse)
        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i];
          const xOff = p.width / 2;
          ctx.lineTo(p.x - xOff, p.y);
        }
        ctx.closePath();
        
        // Gradient along the ribbon
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        const c1 = this.color1;
        const c2 = this.color2;
        
        grad.addColorStop(0, `rgba(${c1.r},${c1.g},${c1.b},0)`);
        grad.addColorStop(0.15, `rgba(${c1.r},${c1.g},${c1.b},${layerOpacity * 0.5})`);
        grad.addColorStop(0.3, `rgba(${c2.r},${c2.g},${c2.b},${layerOpacity})`);
        grad.addColorStop(0.5, `rgba(${c1.r},${c1.g},${c1.b},${layerOpacity * 0.8})`);
        grad.addColorStop(0.7, `rgba(${c2.r},${c2.g},${c2.b},${layerOpacity * 0.6})`);
        grad.addColorStop(0.85, `rgba(${c1.r},${c1.g},${c1.b},${layerOpacity * 0.3})`);
        grad.addColorStop(1, `rgba(${c1.r},${c1.g},${c1.b},0)`);
        
        ctx.fillStyle = grad;
        ctx.filter = `blur(${8 + layer * 4}px)`;
        ctx.fill();
        ctx.filter = 'none';
      }
      
      ctx.restore();
    }
  }
  
  // Create aurora ribbons
  const ribbons = [
    new AuroraRibbon({
      yBase: 0, amplitude: 70, frequency: 0.006, speed: 0.0006,
      phase: 0, width: 100,
      color1: { r: 0, g: 255, b: 128 }, color2: { r: 0, g: 200, b: 255 },
      opacity: 0.25, noiseOffset: 0
    }),
    new AuroraRibbon({
      yBase: 20, amplitude: 55, frequency: 0.009, speed: 0.0008,
      phase: 2.1, width: 80,
      color1: { r: 100, g: 0, b: 255 }, color2: { r: 0, g: 255, b: 180 },
      opacity: 0.2, noiseOffset: 1.5
    }),
    new AuroraRibbon({
      yBase: -10, amplitude: 65, frequency: 0.007, speed: 0.0005,
      phase: 4.2, width: 90,
      color1: { r: 0, g: 200, b: 255 }, color2: { r: 128, g: 0, b: 255 },
      opacity: 0.18, noiseOffset: 3.0
    }),
    new AuroraRibbon({
      yBase: 10, amplitude: 50, frequency: 0.011, speed: 0.001,
      phase: 1.0, width: 70,
      color1: { r: 0, g: 255, b: 200 }, color2: { r: 0, g: 180, b: 255 },
      opacity: 0.15, noiseOffset: 4.5
    }),
    new AuroraRibbon({
      yBase: -5, amplitude: 60, frequency: 0.005, speed: 0.0007,
      phase: 3.5, width: 85,
      color1: { r: 80, g: 0, b: 255 }, color2: { r: 0, g: 255, b: 150 },
      opacity: 0.12, noiseOffset: 6.0
    })
  ];
  
  function animate(t) {
    time.value = t;
    ctx.clearRect(0, 0, w, h);
    
    ribbons.forEach(r => r.draw(ctx, t));
    
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
})();
