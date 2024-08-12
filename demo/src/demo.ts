import TextParticles from "text-particles.js";
import * as dat from "dat.gui";

const canvas = document.getElementById("particleCanvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let textParticles = new TextParticles(canvas, {
  TEXT: "Raiyan",
  FONT: {
    STYLE: "bold",
    SIZE: 50,
    FAMILY: "Arial, sans-serif",
  },
  COLOR: "#ff4f4f",
  PARTICLE_SIZE_MIN: 1,
  PARTICLE_SIZE_MAX: 3,
  PARTICLE_SPACING: 3,
  HOVER_RADIUS: 30,
  CLICK_RADIUS: 100,
  REPULSION_STRENGTH: 30,
  RETURN_SPEED: 10,
  INTERACTION_MODE: "hover",
});

const gui = new dat.GUI();
const options = {
  TEXT: "Text Particles",
  FONT_SIZE: 50,
  FONT_STYLE: "bold",
  FONT_FAMILY: "Arial, sans-serif",
  COLOR: "#ff4f4f",
  PARTICLE_SIZE_MIN: 1,
  PARTICLE_SIZE_MAX: 3,
  PARTICLE_SPACING: 3,
  HOVER_RADIUS: 30,
  CLICK_RADIUS: 100,
  REPULSION_STRENGTH: 30,
  RETURN_SPEED: 10,
  INTERACTION_MODE: "hover",
};

const fontFamilies = [
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
  "Georgia, serif",
  "Times New Roman, serif",
  "Trebuchet MS, sans-serif",
  "Comic Sans MS, sans-serif",
];

gui.add(options, "TEXT").onChange(() => updateTextParticles());
gui.add(options, "FONT_SIZE", 10, 200).onChange(() => updateTextParticles());
gui
  .add(options, "FONT_STYLE", ["normal", "italic", "bold", "bold italic"])
  .onChange(() => updateTextParticles());
gui
  .add(options, "FONT_FAMILY", fontFamilies)
  .onChange(() => updateTextParticles());

gui.addColor(options, "COLOR").onChange(() => updateTextParticles());
gui
  .add(options, "PARTICLE_SIZE_MIN", 0.1, 5)
  .onChange(() => updateTextParticles());
gui
  .add(options, "PARTICLE_SIZE_MAX", 0.1, 5)
  .onChange(() => updateTextParticles());
gui
  .add(options, "PARTICLE_SPACING", 1, 10)
  .onChange(() => updateTextParticles());
gui.add(options, "HOVER_RADIUS", 10, 100).onChange(() => updateTextParticles());
gui.add(options, "CLICK_RADIUS", 10, 200).onChange(() => updateTextParticles());
gui
  .add(options, "REPULSION_STRENGTH", 1, 100)
  .onChange(() => updateTextParticles());
gui.add(options, "RETURN_SPEED", 1, 100).onChange(() => updateTextParticles());
gui
  .add(options, "INTERACTION_MODE", ["hover", "click"])
  .onChange(() => updateTextParticles());

const updateTextParticles = () => {
  textParticles = new TextParticles(canvas, {
    TEXT: options.TEXT,
    FONT: {
      STYLE: options.FONT_STYLE,
      SIZE: options.FONT_SIZE,
      FAMILY: options.FONT_FAMILY,
    },
    COLOR: options.COLOR,
    PARTICLE_SIZE_MIN: options.PARTICLE_SIZE_MIN,
    PARTICLE_SIZE_MAX: options.PARTICLE_SIZE_MAX,
    PARTICLE_SPACING: options.PARTICLE_SPACING,
    HOVER_RADIUS: options.HOVER_RADIUS,
    CLICK_RADIUS: options.CLICK_RADIUS,
    REPULSION_STRENGTH: options.REPULSION_STRENGTH,
    RETURN_SPEED: options.RETURN_SPEED,
    INTERACTION_MODE: options.INTERACTION_MODE as "hover" | "click",
  });
};

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateTextParticles();
});

const fpsCounter = document.getElementById("fpsCounter")!;
let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

const updateFPS = (timestamp: number) => {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = timestamp - lastFrameTime;
  frameCount++;

  if (delta >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFrameTime = timestamp;
    fpsCounter.textContent = `FPS: ${fps}`;
  }

  requestAnimationFrame(updateFPS);
};

updateTextParticles();
requestAnimationFrame(updateFPS);
