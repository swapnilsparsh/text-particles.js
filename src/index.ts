export class TextParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = {
    x: null as number | null,
    y: null as number | null,
    isClicked: false,
  };

  private defaultOptions = {
    TEXT: "Text Particles",
    FONT: {
      STYLE: "bold",
      SIZE: 50,
      FAMILY: "Arial, sans-serif",
    },
    COLOR: "#ff4f4f",
    PARTICLE_SIZE_MIN: 1,
    PARTICLE_SIZE_MAX: 3,
    HOVER_RADIUS: 30,
    CLICK_RADIUS: 100,
    REPULSION_STRENGTH: 30,
    RETURN_SPEED: 10,
    INTERACTION_MODE: "hover",
  };

  private OPTIONS: typeof this.defaultOptions;

  constructor(
    canvas: HTMLCanvasElement,
    options?: {
      TEXT?: string;
      FONT?: {
        STYLE?: string;
        SIZE?: number;
        FAMILY?: string;
      };
      COLOR?: string;
      PARTICLE_SIZE_MIN?: number;
      PARTICLE_SIZE_MAX?: number;
      HOVER_RADIUS?: number;
      CLICK_RADIUS?: number;
      REPULSION_STRENGTH?: number;
      RETURN_SPEED?: number;
      INTERACTION_MODE?: "hover" | "click";
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.OPTIONS = {
      ...this.defaultOptions,
      ...(options && {
        TEXT: options.TEXT ?? this.defaultOptions.TEXT,
        FONT: {
          STYLE: options.FONT?.STYLE ?? this.defaultOptions.FONT.STYLE,
          SIZE: options.FONT?.SIZE ?? this.defaultOptions.FONT.SIZE,
          FAMILY: options.FONT?.FAMILY ?? this.defaultOptions.FONT.FAMILY,
        },
        COLOR: options.COLOR ?? this.defaultOptions.COLOR,
        PARTICLE_SIZE_MIN:
          options.PARTICLE_SIZE_MIN ?? this.defaultOptions.PARTICLE_SIZE_MIN,
        PARTICLE_SIZE_MAX:
          options.PARTICLE_SIZE_MAX ?? this.defaultOptions.PARTICLE_SIZE_MAX,
        HOVER_RADIUS: options.HOVER_RADIUS ?? this.defaultOptions.HOVER_RADIUS,
        CLICK_RADIUS: options.CLICK_RADIUS ?? this.defaultOptions.CLICK_RADIUS,
        REPULSION_STRENGTH:
          options.REPULSION_STRENGTH ?? this.defaultOptions.REPULSION_STRENGTH,
        RETURN_SPEED: options.RETURN_SPEED ?? this.defaultOptions.RETURN_SPEED,
        INTERACTION_MODE:
          options.INTERACTION_MODE ?? this.defaultOptions.INTERACTION_MODE,
      }),
    };

    this.handleCanvasSize();
    this.init();
    this.animate();
    this.setupEventListeners();
  }

  private handleCanvasSize() {
    if (this.canvas.parentElement) {
      this.canvas.width = this.canvas.parentElement.offsetWidth;
      this.canvas.height = this.canvas.parentElement.offsetHeight;
    }
  }

  private init() {
    this.handleCanvasSize();
    this.particles.length = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fontString = `${this.OPTIONS.FONT.STYLE} ${this.OPTIONS.FONT.SIZE}px ${this.OPTIONS.FONT.FAMILY}`;
    this.ctx.font = fontString;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      this.OPTIONS.TEXT,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    const textCoordinates = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    for (let y = 0; y < textCoordinates.height; y += 3) {
      for (let x = 0; x < textCoordinates.width; x += 3) {
        if (
          textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
        ) {
          this.particles.push(new Particle(x, y, this.OPTIONS, this.mouse));
        }
      }
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.draw(this.ctx);
      particle.update();
    });
    requestAnimationFrame(() => this.animate());
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => {
      this.handleCanvasSize();
      this.init();
    });

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = event.clientX - this.canvas.getBoundingClientRect().left;
      this.mouse.y = event.clientY - this.canvas.getBoundingClientRect().top;
    });

    window.addEventListener("mousedown", () => {
      this.mouse.isClicked = true;
    });

    window.addEventListener("mouseup", () => {
      this.mouse.isClicked = false;
    });

    window.addEventListener("touchstart", (event) => {
      this.mouse.x =
        event.touches[0].clientX - this.canvas.getBoundingClientRect().left;
      this.mouse.y =
        event.touches[0].clientY - this.canvas.getBoundingClientRect().top;
      this.mouse.isClicked = true;
    });

    window.addEventListener("touchmove", (event) => {
      this.mouse.x =
        event.touches[0].clientX - this.canvas.getBoundingClientRect().left;
      this.mouse.y =
        event.touches[0].clientY - this.canvas.getBoundingClientRect().top;
    });

    window.addEventListener("touchend", () => {
      this.mouse.isClicked = false;
    });
  }
}

class Particle {
  private x: number;
  private y: number;
  private size: number;
  private baseX: number;
  private baseY: number;
  private density: number;
  private angle: number;

  constructor(x: number, y: number, private OPTIONS: any, private mouse: any) {
    this.x = x + (Math.random() - 0.5) * 3;
    this.y = y + (Math.random() - 0.5) * 3;
    this.size =
      Math.random() * (OPTIONS.PARTICLE_SIZE_MAX - OPTIONS.PARTICLE_SIZE_MIN) +
      OPTIONS.PARTICLE_SIZE_MIN;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * OPTIONS.REPULSION_STRENGTH + 1;
    this.angle = Math.random() * 360;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.OPTIONS.COLOR;
    ctx.fill();
  }

  update() {
    let dx = this.mouse.x - this.x;
    let dy = this.mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance =
      this.OPTIONS.INTERACTION_MODE === "hover"
        ? this.OPTIONS.HOVER_RADIUS
        : this.OPTIONS.CLICK_RADIUS;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (
      distance < maxDistance &&
      (this.OPTIONS.INTERACTION_MODE === "hover" ||
        (this.OPTIONS.INTERACTION_MODE === "click" && this.mouse.isClicked))
    ) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / this.OPTIONS.RETURN_SPEED;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / this.OPTIONS.RETURN_SPEED;
      }
    }

    this.angle += 1;
    if (this.angle >= 360) this.angle = 0;
  }
}

export default TextParticles;
