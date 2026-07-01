/* ==========================================================================
   JavaScript Scrapbook Logic - Polished & Interactive
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger typewriter when closing section is visible
        if (entry.target.id === 'closing') {
          startTypewriter();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all items marked for scroll reveal
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Trigger cover page assembly load animation
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 150);


  // 2. Synthetic Audio Helper (Web Audio API)
  let audioCtx = null;
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playKnockSound = () => {
    initAudio();
    if (!audioCtx) return;
    
    // Create wood knock synthesis
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.12);
    
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  };


  // 3. "TokTok" Knock Interaction
  const knockTarget = document.getElementById('knock-target');
  const knockReveal = document.getElementById('knock-reveal');
  const fistContainer = document.querySelector('.fist-container');
  let knockCount = 0;
  let isKnocking = false;

  knockTarget.addEventListener('click', () => {
    if (isKnocking) return;
    isKnocking = true;
    
    // Reset classes
    fistContainer.classList.remove('knock-anim');
    void fistContainer.offsetWidth; // Trigger reflow
    
    // Add knocking class
    fistContainer.classList.add('knock-anim');
    
    // Synthesize two quick knock sounds aligned with the double-bounce animation
    playKnockSound();
    setTimeout(() => {
      playKnockSound();
    }, 200);

    // After animation finishes
    setTimeout(() => {
      isKnocking = false;
      knockCount++;
      
      // Reveal the toktok bubble on first double-knock
      if (knockCount >= 1) {
        knockReveal.classList.add('revealed');
        const countIndicator = knockCount > 1 ? ` (${knockCount})` : '';
        knockReveal.querySelector('.reveal-content').textContent = `toktok🤜🤜${countIndicator}`;
      }
    }, 400);
  });


  // 4. Tap-To-Open Envelope
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  
  envelopeWrapper.addEventListener('click', (e) => {
    // Prevent toggle loop if tapping interactive parts of the letter
    if (e.target.closest('.letter-inner')) {
      return; 
    }
    initAudio();
    envelopeWrapper.classList.toggle('open');
  });


  // 5. Typewriter Animation for Closing Section
  const typewriterText = document.getElementById('typewriter-text');
  const messageStr = "Happy Birthday! 🎉\n\nI am so incredibly lucky to have met you this year. Even though we haven't been friends for long, you've quickly become one of my favorite people to chat and laugh with. Thank you for your warmth, your hilarious humor, and for always being such a supportive, awesome friend.\n\nHere's to celebrating you today, and to many more years of our awesome friendship! 🎂✨";
  let hasTyped = false;

  function startTypewriter() {
    if (hasTyped) return;
    hasTyped = true;
    
    let index = 0;
    typewriterText.innerHTML = '';
    
    function type() {
      if (index < messageStr.length) {
        const char = messageStr.charAt(index);
        if (char === '\n') {
          typewriterText.innerHTML += '<br>';
        } else {
          typewriterText.innerHTML += char;
        }
        index++;
        
        // Add varying speed for realistic typing flow
        const delay = char === '.' || char === '!' || char === '?' ? 400 : Math.random() * 40 + 20;
        setTimeout(type, delay);
      } else {
        typewriterText.classList.add('finished');
      }
    }
    
    // Start delay
    setTimeout(type, 500);
  }


  // (Removed unused Cassette Player Sound Generator)


  // 7. Ambient Particle Engine & Candle Sparks Burst
  const canvas = document.getElementById('interactive-canvas');
  const ctx = canvas.getContext('2d');
  
  let explosionParticles = [];
  let ambientParticles = [];
  
  // Track scroll position to calculate scroll parallax offsets
  let lastScrollY = window.scrollY;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Re-initialize ambient particles on window resize or load
    if (ambientParticles.length === 0) {
      for (let i = 0; i < 45; i++) {
        ambientParticles.push(new AmbientParticle());
      }
    }
  }
  window.addEventListener('resize', resizeCanvas);

  // Scroll listener to shift particles slightly creating a parallax effect
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    
    // Adjust y coordinates of ambient particles for parallax depth feel
    ambientParticles.forEach(p => {
      p.y -= deltaY * p.parallaxSpeed;
      
      // Wrap around boundary check
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    
    lastScrollY = currentScrollY;
  });

  // Ambient Star Dust Particles
  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initialSetup = false) {
      this.x = Math.random() * canvas.width;
      this.y = initialSetup ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * -0.4 - 0.2; // Slowly drifts upward
      this.speedX = Math.random() * 0.4 - 0.2;  // Soft horizontal sway
      this.opacity = Math.random() * 0.45 + 0.15;
      this.parallaxSpeed = Math.random() * 0.2 + 0.08; // different speed layers
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.wobbleAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      
      // Add subtle wavy side-to-side drift
      this.wobbleAngle += this.wobbleSpeed;
      this.x += Math.sin(this.wobbleAngle) * 0.15 + this.speedX;

      // Reset when particle floats off top or sides
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#c5a059'; // warm gold sparkle tone
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#c5a059';
      ctx.fill();
      ctx.restore();
    }
  }

  // Active explosion particle class
  class ActiveParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 3;
      this.speedX = Math.random() * 8 - 4;
      this.speedY = Math.random() * -12 - 4; // Shoot upwards initially
      this.gravity = 0.25;
      this.friction = 0.98;
      this.color = color;
      this.opacity = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.speedY += this.gravity;
      this.speedX *= this.friction;
      this.speedY *= this.friction;
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const explosionColors = [
    '#c5a059', // gold
    '#c48b9f', // dusty rose
    '#f6f3eb', // cream
    '#ffd700', // yellow gold
    '#ff69b4', // bright rose
    '#ffffff'  // white sparkles
  ];

  function createExplosion(x, y) {
    for (let i = 0; i < 70; i++) {
      const color = explosionColors[Math.floor(Math.random() * explosionColors.length)];
      explosionParticles.push(new ActiveParticle(x, y, color));
    }
  }

  // Loop that updates all particles
  function animateEngine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Update and Draw Ambient Particles
    ambientParticles.forEach(p => {
      p.update();
      p.draw();
    });

    // 2. Update and Draw Active Explosion Particles
    for (let i = explosionParticles.length - 1; i >= 0; i--) {
      explosionParticles[i].update();
      explosionParticles[i].draw();
      
      if (explosionParticles[i].opacity <= 0) {
        explosionParticles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animateEngine);
  }

  // Initialize canvas sizes
  resizeCanvas();
  
  // Start the background animation loop
  animateEngine();

  // Candle elements listeners
  const candleElement = document.getElementById('candle-element');
  
  candleElement.addEventListener('click', (e) => {
    if (candleElement.classList.contains('blown-out')) return; // Already blown
    
    initAudio();
    candleElement.classList.add('blown-out');
    
    // Play a gentle blow/sweep audio cue
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }

    // Get click location relative to screen viewport
    const rect = candleElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + 15; // approximate flame position

    // Trigger magical sparkles explosion!
    createExplosion(x, y);
    
    // Change instruction text
    const instruct = document.querySelector('.candle-instruction');
    instruct.textContent = "Wish made! Happy Birthday! ✨❤️";
    instruct.style.color = 'var(--color-accent-rose)';
  });

  // 8. Voice Message Player Controls
  const voiceAudio = document.getElementById('voice-audio');
  const voicePlayBtn = document.getElementById('voice-play-btn');
  const voicePlayIcon = document.getElementById('voice-play-icon');
  const voiceProgressBar = document.getElementById('voice-progress-bar');
  const voiceProgressContainer = document.getElementById('voice-progress-container');
  const voiceTimeCurrent = document.getElementById('voice-time-current');
  const voiceTimeTotal = document.getElementById('voice-time-total');

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Update total duration when metadata is ready
  const setTotalDuration = () => {
    voiceTimeTotal.textContent = formatTime(voiceAudio.duration);
  };

  if (voiceAudio.readyState >= 1) {
    setTotalDuration();
  } else {
    voiceAudio.addEventListener('loadedmetadata', setTotalDuration);
  }
  
  // Fallback check if browser does not fire loadedmetadata for some media types
  voiceAudio.addEventListener('durationchange', setTotalDuration);

  voicePlayBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop envelope from folding/unfolding when tapping play
    initAudio();
    
    if (voiceAudio.paused) {
      // Pause cassette player if playing to avoid double audio overlap
      if (isPlaying) {
        mixtapePlay.click();
      }
      
      voiceAudio.play().then(() => {
        voicePlayIcon.textContent = "⏸";
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    } else {
      voiceAudio.pause();
      voicePlayIcon.textContent = "▶";
    }
  });

  voiceAudio.addEventListener('timeupdate', () => {
    const current = voiceAudio.currentTime;
    const duration = voiceAudio.duration || 0;
    if (duration > 0) {
      const percentage = (current / duration) * 100;
      voiceProgressBar.style.width = `${percentage}%`;
    }
    voiceTimeCurrent.textContent = formatTime(current);
  });

  voiceAudio.addEventListener('ended', () => {
    voicePlayIcon.textContent = "▶";
    voiceProgressBar.style.width = "0%";
    voiceTimeCurrent.textContent = "0:00";
  });

  voiceProgressContainer.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent envelope tap events
    const rect = voiceProgressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = voiceAudio.duration || 0;
    
    if (duration > 0) {
      const newTime = (clickX / width) * duration;
      voiceAudio.currentTime = newTime;
      voiceProgressBar.style.width = `${(newTime / duration) * 100}%`;
    }
  });

  // 6. Lightbox Fullscreen View Logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  const registerLightboxItem = (item, imgSelector, captionSelector) => {
    item.addEventListener('click', () => {
      const img = item.querySelector(imgSelector);
      const caption = item.querySelector(captionSelector);
      
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption ? caption.textContent : "";
      
      lightbox.classList.add('active');
      lightbox.style.display = 'flex';
      setTimeout(() => {
        lightbox.style.opacity = '1';
      }, 10);
    });
  };

  document.querySelectorAll('.screenshot-item').forEach(item => {
    registerLightboxItem(item, '.screenshot-img', '.screenshot-caption');
  });

  document.querySelectorAll('.gallery-item').forEach(item => {
    registerLightboxItem(item, '.gallery-img', '.gallery-caption');
  });

  const closeLightbox = () => {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.classList.remove('active');
      lightbox.style.display = 'none';
    }, 300);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });

});
