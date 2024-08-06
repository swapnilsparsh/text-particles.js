interface TextParticlesOptions {
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
  particleSize?: number;
  particleSpacing?: number;
  hoverRadius?: number;
  clickRadius?: number;
  repulsionStrength?: number;
  returnSpeed?: number;
  interactionMode?: "hover" | "click";
  particleShape?: "circle" | "square" | "triangle";
  useGradient?: boolean;
}

class TextParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private options: TextParticlesOptions;
  private mouse: { x: number | null; y: number | null; isClicked: boolean } = {
    x: null,
    y: null,
    isClicked: false,
  };
  private animationFrame: number | null = null;

  constructor(container: HTMLElement, options: TextParticlesOptions) {
    this.options = {
      fontFamily: "Arial, sans-serif",
      particleSize: 2,
      particleSpacing: 3,
      hoverRadius: 100,
      clickRadius: 200,
      repulsionStrength: 30,
      returnSpeed: 10,
      interactionMode: "hover",
      particleShape: "circle",
      useGradient: false,
      ...options,
    };

    const existingCanvas = container.querySelector("canvas");
    if (existingCanvas) {
      container.removeChild(existingCanvas);
    }

    this.canvas = document.createElement("canvas");
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;

    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;

    this.init();
    this.animate();
    this.addEventListeners();
  }

  private init(): void {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fontString = `${this.options.fontSize}px ${this.options.fontFamily}`;
    this.ctx.font = fontString;
    this.ctx.fillStyle = this.options.color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      this.options.text,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    const textCoordinates = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    for (
      let y = 0;
      y < textCoordinates.height;
      y += this.options.particleSpacing!
    ) {
      for (
        let x = 0;
        x < textCoordinates.width;
        x += this.options.particleSpacing!
      ) {
        if (
          textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
        ) {
          this.particles.push(new Particle(x, y, this.options));
        }
      }
    }
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const particle of this.particles) {
      particle.draw(this.ctx);
      particle.update(this.mouse, this.options);
    }
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private addEventListeners(): void {
    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    });

    this.canvas.addEventListener("mousedown", () => {
      this.mouse.isClicked = true;
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.isClicked = false;
    });

    this.canvas.addEventListener("touchstart", (event) => {
      this.mouse.x = event.touches[0].clientX;
      this.mouse.y = event.touches[0].clientY;
      this.mouse.isClicked = true;
    });

    this.canvas.addEventListener("touchmove", (event) => {
      this.mouse.x = event.touches[0].clientX;
      this.mouse.y = event.touches[0].clientY;
    });

    this.canvas.addEventListener("touchend", () => {
      this.mouse.isClicked = false;
    });

    window.addEventListener("resize", () => {
      this.canvas.width = this.canvas.parentElement!.clientWidth;
      this.canvas.height = this.canvas.parentElement!.clientHeight;
      this.init();
    });
    window.addEventListener("resize", this.resizeHandler);
  }

  private resizeHandler = (): void => {
    this.canvas.width = this.canvas.parentElement!.clientWidth;
    this.canvas.height = this.canvas.parentElement!.clientHeight;
    this.init();
  };

  public destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener("resize", this.resizeHandler);
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

class Particle {
  private x: number;
  private y: number;
  private size: number;
  private baseX: number;
  private baseY: number;
  private density: number;
  color!: string | CanvasGradient | CanvasPattern;
  shape: any;

  constructor(x: number, y: number, options: TextParticlesOptions) {
    this.x = x + (Math.random() - 0.5) * options.particleSpacing!;
    this.y = y + (Math.random() - 0.5) * options.particleSpacing!;
    this.size = Math.random() * options.particleSize! + 1;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * options.repulsionStrength! + 1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    switch (this.shape) {
      case "square":
        ctx.rect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
        break;
      case "triangle":
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        break;
      default: // circle
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }

    ctx.closePath();
    ctx.fill();
  }

  update(
    mouse: { x: number | null; y: number | null; isClicked: boolean },
    options: TextParticlesOptions
  ): void {
    if (mouse.x === null || mouse.y === null) return;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance =
      options.interactionMode === "hover"
        ? options.hoverRadius
        : options.clickRadius;
    const force = (maxDistance! - distance) / maxDistance!;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (
      distance < maxDistance! &&
      (options.interactionMode === "hover" ||
        (options.interactionMode === "click" && mouse.isClicked))
    ) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / options.returnSpeed!;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / options.returnSpeed!;
      }
    }
  }
}

export default TextParticles;
