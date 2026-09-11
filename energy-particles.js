// energy-particles.js - Floating energy particles around phone
(function(){
  const wrapper = document.getElementById('phone3d');
  if (!wrapper) return;
  
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;';
  wrapper.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let w, h;
  function resize(){
    const rect = wrapper.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const PARTICLE_COUNT = 25;
  const colors = [
    { r:52, g:208, b:88 },
    { r:88, g:166, b:255 },
    { r:63, g:185, b:80 },
    { r:121, g:192, b:255 }
  ];
  
  function createParticle(){
    const angle = Math.random() * Math.PI * 2;
    const radiusX = 90 + Math.random() * 50;
    const radiusY = 130 + Math.random() * 40;
    const tiltX = 70 * Math.PI / 180;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      angle: angle,
      radiusX: radiusX,
      radiusY: radiusY,
      tiltX: tiltX,
      speed: (0.01 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1),
      size: 1 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.5,
      color: color,
      phase: Math.random() * Math.PI * 2,
      flickerSpeed: 0.02 + Math.random() * 0.03
    };
  }
  
  for(let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  
  function project3D(x, y, z, tiltX){
    const cosT = Math.cos(tiltX);
    const sinT = Math.sin(tiltX);
    const ry = y * cosT - z * sinT;
    const rz = y * sinT + z * cosT;
    const scale = 1 / (1 + rz * 0.003);
    return { x: w/2 + x * scale, y: h/2 + ry * scale, z: rz, scale: scale };
  }
  
  function draw(){
    ctx.clearRect(0, 0, w, h);
    
    particles.forEach(p => {
      p.angle += p.speed;
      p.phase += p.flickerSpeed;
      
      const x = Math.cos(p.angle) * p.radiusX;
      const y = Math.sin(p.angle) * p.radiusY;
      const z = Math.sin(p.angle) * 20;
      
      const proj = project3D(x, y, z, p.tiltX);
      
      const flicker = 0.5 + 0.5 * Math.sin(p.phase);
      const alpha = p.opacity * flicker * proj.scale;
      
      if(alpha < 0.05) return;
      
      const size = p.size * proj.scale;
      const c = p.color;
      
      // Glow
      const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, size * 4);
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.8})`);
      grad.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${alpha * 0.3})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, size * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
})();
