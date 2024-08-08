declare module "text-particles.js" {
  export default class TextParticles {
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
        PARTICLE_SPACING?: number;
        HOVER_RADIUS?: number;
        CLICK_RADIUS?: number;
        REPULSION_STRENGTH?: number;
        RETURN_SPEED?: number;
        INTERACTION_MODE?: "hover" | "click";
      }
    );
  }
}
