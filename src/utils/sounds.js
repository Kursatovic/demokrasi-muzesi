// Web Audio API Utils for procedural sound effects

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

export const sounds = {
  click: () => {
    playTone(600, 'sine', 0.05, 0.05);
  },
  hover: () => {
    playTone(800, 'sine', 0.03, 0.02);
  },
  success: () => {
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.4, 0.1), 200); // G5
  },
  error: () => {
    playTone(300, 'sawtooth', 0.2, 0.1);
    setTimeout(() => playTone(250, 'sawtooth', 0.4, 0.1), 150);
  },
  chestOpen: () => {
    // Deep rumble
    playTone(100, 'triangle', 1.5, 0.2);
    setTimeout(() => playTone(150, 'triangle', 1.0, 0.1), 300);
    setTimeout(() => playTone(200, 'triangle', 0.8, 0.1), 600);
    // Accompanied by a magical sweep
    let now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 1.5);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.5);
  },
  examComplete: () => {
    // Triumphant Fanfare
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'square', 0.2, 0.05), idx * 150);
    });
    setTimeout(() => {
      playTone(1046.50, 'square', 0.6, 0.05);
      playTone(880, 'sine', 0.6, 0.05);
    }, 450);
  }
};
