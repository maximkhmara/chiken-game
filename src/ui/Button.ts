import { Container, Sprite, Assets, Ticker } from 'pixi.js';

export class Button extends Container {
  private sprite!: Sprite;
  private originalScale = 1.6;
  private isHovered = false;

  constructor(label: string, x: number, y: number, onClick: () => void) {
    super();

    Assets.load('/assets/buttons/start-btn.png').then((texture) => {
      this.sprite = new Sprite(texture);
      this.sprite.anchor.set(0.5);

      // 📍 Початкове зміщення та розмір
      this.sprite.y += 150;
      this.sprite.scale.set(this.originalScale);

      this.addChild(this.sprite);

      // 🔘 Події
      this.eventMode = 'static';
      this.cursor = 'pointer';
      this.on('pointerdown', onClick);
      this.on('pointerover', () => (this.isHovered = true));
      this.on('pointerout', () => (this.isHovered = false));

      // 🔁 Анімація "відскоку"
      Ticker.shared.add(this.animate, this);
    });

    this.x = x;
    this.y = y;
  }

  private animate() {
    if (!this.sprite) return;

    const targetScale = this.isHovered ? this.originalScale * 1.1 : this.originalScale;
    const currentScale = this.sprite.scale.x;

    // Плавне масштабування
    const lerped = currentScale + (targetScale - currentScale) * 0.2;
    this.sprite.scale.set(lerped);
  }
}