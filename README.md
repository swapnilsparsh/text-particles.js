[![](https://img.shields.io/npm/v/text-particles.js.svg)](https://www.npmjs.com/package/text-particles.js) 
[![ci](https://github.com/swapnilsparsh/text-particles.js/actions/workflows/main.yml/badge.svg)](https://github.com/swapnilsparsh/text-particles,js/actions/workflows/main.yml)
[![](https://data.jsdelivr.com/v1/package/npm/text-particles.js/badge)](https://www.jsdelivr.com/package/npm/text-particles.js)

# text-particles.js
`text-particles.js` is a lightweight TypeScript library for creating dynamic text particle effects using the Canvas API.

![text-particles.js](https://github.com/user-attachments/assets/b620e7d0-50bf-4a42-a69d-8e9525cd1d4c)

# Installation

```sh
npm install text-particles.js
```
or
```sh
yarn add text-particles.js
```
or
```sh
pnpm add text-particles.js
```
via [CDN](https://www.jsdelivr.com/package/npm/text-particles.js)
```
https://cdn.jsdelivr.net/npm/text-particles.js/dist/index.min.js
```

# Usage
## React
```
import React, { useEffect, useRef } from "react";
import TextParticles from "text-particles.js";

const ParticleTextEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      new TextParticles(canvasRef.current, {
        TEXT: "Your Text Here",
        FONT: {
          SIZE: 100,
        },
      });
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ParticleTextEffect;
```

## Angular
```
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import TextParticles from 'text-particles.js';

@Component({
  selector: 'app-particle-text',
  template: '<div #canvasContainer style="width: 100%; height: 300px;"><canvas #canvas></canvas></div>',
})
export class ParticleTextComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    new TextParticles(canvas, {
      TEXT: 'Your Text Here',
      FONT: {
          SIZE: 100,
        },
    });
  }
}
```

## Svelte
```
<script>
  import { onMount } from 'svelte';
  import TextParticles from 'text-particles.js';

  let canvas;

  onMount(() => {
    new TextParticles(canvas, {
      TEXT: 'Your Text Here',
      FONT: {
          SIZE: 100,
        },
    });
  });
</script>

<div style="width: 100%; height: 300px;">
  <canvas bind:this={canvas}></canvas>
</div>
```

## Vue.js
```
<template>
  <div style="width: 100%; height: 300px;">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import TextParticles from 'text-particles.js';

export default defineComponent({
  name: 'ParticleTextEffect',
  setup() {
    onMounted(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      new TextParticles(canvas, {
        TEXT: 'Your Text Here',
        FONT: {
          SIZE: 100,
        },
      });
    });
  }
});
</script>
```

# Options

| Option                  | Description                                             | Default               |
|-------------------------|---------------------------------------------------------|-----------------------|
| `TEXT`                  | The text to display.                                   | "Text Particles"      |
| `FONT`                  | Font settings for the text.                            |                       |
| `  STYLE`               | Font style (e.g., "bold").                             | "bold"                |
| `  SIZE`                | Font size in pixels.                                  | 50                    |
| `  FAMILY`              | Font family.                                           | "Arial, sans-serif"   |
| `COLOR`                 | The color of the particles.                            | "#ff4f4f"             |
| `PARTICLE_SIZE_MIN`     | Minimum size of the particles.                         | 1                     |
| `PARTICLE_SIZE_MAX`     | Maximum size of the particles.                         | 3                     |
| `HOVER_RADIUS`          | Radius for hover interactions.                         | 30                    |
| `CLICK_RADIUS`          | Radius for click interactions.                         | 100                   |
| `REPULSION_STRENGTH`    | Strength of the repulsion effect.                      | 30                    |
| `RETURN_SPEED`          | Speed at which particles return to their original positions. | 10                |
| `INTERACTION_MODE`      | Interaction mode, either "hover" or "click".           | "hover"               |


# LICENSE
This project is licensed under the [MIT License](/LICENSE)
