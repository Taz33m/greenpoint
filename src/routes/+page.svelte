<script>
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import { spring } from 'svelte/motion';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let particles = [];
  let leaves = [];

  onMount(() => {
    // Initialize particles
    particles = Array(30).fill().map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.1
    }));

    // Initialize eco elements
    leaves = Array(15).fill().map(() => ({
      emoji: ['🌱', '🍃', '🌿', '☘️'][Math.floor(Math.random() * 4)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      size: Math.random() * 0.4 + 0.3,
      speed: Math.random() * 1 + 0.5,
      wobbleSpeed: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
  });

  let selectedVehicle = null;
  let isZooming = false;
  let showCarbonFootprint = false;

  const carbonFootprints = {
    '🚗': 120,  // Average car
    '🚕': 150,  // Taxi
    '🚙': 130,  // SUV
    '🚌': 80,   // Bus (per passenger)
    '🚲': 0,    // Bicycle
    '🛵': 70,   // Scooter
    '✈️': 250,  // Plane
    '🛥': 180,  // Boat
    '🚊': 40,   // Train
    '🏍': 100   // Motorcycle
  };

  function startZoom(vehicle) {
    if (!isZooming) {
      selectedVehicle = vehicle;
      isZooming = true;
      showCarbonFootprint = true;
      setTimeout(() => {
        isZooming = false;
        selectedVehicle = null;
        setTimeout(() => {
          showCarbonFootprint = false;
        }, 800);
      }, 3000);
    }
  }
</script>

<main>
  <div class="eco-background">
    {#each particles as particle}
      <div
        class="particle"
        style="
          --x: {particle.x}%;
          --y: {particle.y}%;
          --size: {particle.size}px;
          --speed: {particle.speed}s;
          --opacity: {particle.opacity};
        "
      ></div>
    {/each}
    
    {#each leaves as leaf}
      <div
        class="leaf"
        style="
          --x: {leaf.x}%;
          --y: {leaf.y}%;
          --rotation: {leaf.rotation}deg;
          --size: {leaf.size}rem;
          --speed: {leaf.speed}s;
          --wobble-speed: {leaf.wobbleSpeed}s;
          --delay: {leaf.delay}s;
        "
      >
        {leaf.emoji}
      </div>
    {/each}
  </div>

  <div class="gradient-overlay"></div>
  <div class="particles">
    {#each Array(30) as _, i}
      <div 
        class="particle"
        style="
          --delay: {i * 0.7}s; 
          --top: {Math.random() * 100}%; 
          --left: {Math.random() * 100}%; 
          --moveX: {(Math.random() - 0.5) * 200}px"
      ></div>
    {/each}
  </div>

  <section class="hero">
    <nav>
      <div class="logo" in:fly="{{ y: -20, duration: 1000 }}">🟢 GreenPoint</div>
    </nav>

    <div class="hero-content">
      <h1 in:fly="{{ y: 30, duration: 1000, delay: 400 }}">Stay Green,<br>Save The Planet</h1>
      <p in:fly="{{ y: 30, duration: 1000, delay: 600 }}">Earn points to reduce your carbon footprint, win-win.</p>
      
      <button 
        class="cta-button"
        on:click={() => goto('/journey/start')}
        in:fly="{{ y: 30, duration: 1000, delay: 800 }}">
        Start Your Green Journey
      </button>

      <div class="journey-container">
        <div class="point point-a">
          <span class="emoji">🏠</span>
        </div>

        <div class="path-container">
          <div class="path"></div>
          <div class="animation-container">
            {#each [
              { emoji: '🚗', phase: 0 },     // 🚗
              { emoji: '🚕', phase: 0.1 },   // 🚕
              { emoji: '🚙', phase: 0.2 },   // 🚙
              { emoji: '🚌', phase: 0.3 },   // 🚌
              { emoji: '🚲', phase: 0.4 },   // 🚲
              { emoji: '🛵', phase: 0.5 },   // 🛵
              { emoji: '✈️', phase: 0.6 },   // ✈️
              { emoji: '🛥', phase: 0.7 },   // 🛥️
              { emoji: '🚊', phase: 0.8 },   // 🚊
              { emoji: '🏍', phase: 0.9 }    // 🏍️
            ] as vehicle}
              <div 
                class="vehicle {selectedVehicle === vehicle ? 'zooming' : ''}"
                style="
                  --phase: {vehicle.phase};
                  --wobble: {Math.random() * 5}px;
                "
                on:click={() => startZoom(vehicle)}
              >
                <span class="emoji">{vehicle.emoji}</span>
                {#if selectedVehicle === vehicle}
                  <span class="smoke">💨</span>
                {/if}
              </div>
            {/each}
          </div>
          {#if showCarbonFootprint && selectedVehicle}
            <div class="carbon-footprint" 
              in:fly="{{ y: 20, duration: 400 }}"
              out:fly="{{ y: 20, duration: 300 }}"
            >
              <div class="bracket"></div>
              <div class="carbon-value">
                <span class="number">{carbonFootprints[selectedVehicle.emoji]}</span>
                <span class="unit">kg CO₂</span>
              </div>
            </div>
          {/if}
        </div>

        <div class="point point-b">
          <span class="emoji">📍</span>
        </div>
      </div>
    </div>
  </section>


</main>

<style>
  main {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%);
  }

  .eco-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .gradient-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 30%, rgba(0, 179, 0, 0.05) 0%, transparent 70%),
                radial-gradient(circle at 70% 70%, rgba(0, 179, 0, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }

  .leaf {
    position: absolute;
    left: var(--x);
    top: var(--y);
    font-size: var(--size);
    transform-origin: center;
    animation: float var(--speed) infinite ease-in-out,
               wobble var(--wobble-speed) infinite ease-in-out;
    animation-delay: var(--delay);
    opacity: 0.4;
    filter: blur(0.3px);
    z-index: 1;
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    background: var(--primary-color);
    border-radius: 50%;
    opacity: var(--opacity);
    animation: rise var(--speed) infinite ease-out;
    filter: blur(1px);
    z-index: 1;
    animation-delay: var(--delay);
  }

  @keyframes rise {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(20px, -20px);
    }
    50% {
      transform: translate(0, -40px);
    }
    75% {
      transform: translate(-20px, -20px);
    }
  }

  @keyframes float {
    0% {
      transform: translate(0, 100vh) scale(0);
      opacity: 0;
    }
    20% {
      opacity: 0.3;
    }
    50% {
      transform: translate(var(--moveX), 20vh) scale(1);
      opacity: 0.5;
    }
    80% {
      opacity: 0.3;
    }
    100% {
      transform: translate(calc(var(--moveX) * 2), -20vh) scale(0);
      opacity: 0;
    }
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
  }



  .hero {
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 6vh;
    background: 
      radial-gradient(circle at 20% 20%, rgba(0, 179, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(0, 179, 0, 0.05) 0%, transparent 50%),
      linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95));
    overflow: hidden;
  }

  .journey-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 85vw;
    margin: 3.5rem -1rem 0;
    position: relative;
  }

  .point {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;
    min-width: 80px;
  }

  .emoji {
    font-size: 2rem;
  }

  .label {
    font-weight: 600;
    color: var(--text);
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .path-container {
    flex: 1;
    position: relative;
    height: 40px;
    margin: 0;
    display: flex;
    align-items: center;
  }

  .path {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-color);
    opacity: 0.15;
    transform: translateY(-50%);
    z-index: 1;
  }

  .animation-container {
    width: 160px;
    height: 100px;
    position: absolute;
    left: 2%;
    top: 60%;
    transform: translate(-50%, -80%);
    z-index: 2;
  }

  .vehicle {
    position: absolute;
    font-size: 0.7rem;
    top: 50%;
    left: 50%;
    transform-origin: 40px;
    animation: orbit 15s linear infinite, wobble 3s ease-in-out infinite;
    animation-delay: calc(var(--phase) * -15s), 0s;
    z-index: 3;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .vehicle.zooming {
    animation: zoom 2s ease-out forwards;
    z-index: 10;
  }

  .vehicle.zooming .emoji {
    transform: scaleX(-1);
  }

  .smoke {
    position: absolute;
    right: -1.5rem;
    top: 50%;
    transform: translateY(-50%);
    animation: fade-smoke 1s ease-out infinite;
  }

  @keyframes zoom {
    0% {
      transform: rotate(0) translateX(40px) scale(1);
    }
    15% {
      transform: rotate(0) translateX(40px) scale(1.2);
    }
    100% {
      transform: translateX(calc(85vw - 80px)) scale(1);
    }
  }

  .carbon-footprint {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--primary-color);
    opacity: 0.9;
  }

  .bracket {
    font-size: 1.2rem;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .bracket::before {
    content: '';
    position: absolute;
    top: 0;
    left: 2%;
    right: 2%;
    height: 2px;
    background: var(--primary-color);
    opacity: 0.3;
  }

  .bracket::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--primary-color);
    opacity: 0.3;
    transform: translateX(-50%);
  }

  .carbon-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.85rem;
    background: rgba(0, 179, 0, 0.08);
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    gap: 0.2rem;
  }

  .number {
    font-weight: bold;
    font-size: 1rem;
  }

  .unit {
    opacity: 0.8;
  }

  @keyframes fade-smoke {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-50%) translateX(-20px);
    }
  }

  @keyframes orbit {
    from {
      transform: rotate(0deg) translateX(40px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(40px) rotate(-360deg);
    }
  }

  @keyframes wobble {
    0%, 100% {
      margin-top: 0;
    }
    50% {
      margin-top: var(--wobble);
    }
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, transparent 30%, rgba(0, 179, 0, 0.03) 70%);
    animation: rotateBackground 30s linear infinite;
    z-index: 0;
  }

  @keyframes rotateBackground {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .hero-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2rem;
    padding-top: 12vh;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    gap: 1.5rem;
    z-index: 2;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    background: linear-gradient(120deg, var(--primary-color), var(--primary-dark));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .hero p {
    font-size: 1.4rem;
    color: #666;
    max-width: 600px;
    margin: 0;
  }

  .cta-button {
    background: var(--primary-color);
    border: none;
    padding: 1.2rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 700;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .join-section .cta-button {
    background: white;
    color: var(--primary-color);
    margin-top: 2rem;
  }

  .cta-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--primary-dark);
    border-radius: 30px;
    z-index: -2;
  }

  .cta-button::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--accent);
    transition: all 0.3s ease;
    border-radius: 30px;
    z-index: -1;
  }

  .cta-button:hover {
    color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 179, 0, 0.3);
  }

  .cta-button:hover::before {
    width: 100%;
  }



  .feature-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 179, 0, 0.15);
  }

  .feature-card:hover::before {
    transform: scaleX(1);
  }

  .hero {
    position: relative;
  }





  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .feature-card h3 {
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .feature-card p {
    color: #666;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .features {
      grid-template-columns: 1fr;
    }
  }
</style>
