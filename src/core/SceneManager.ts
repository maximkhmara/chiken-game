import { Container } from 'pixi.js';

export class SceneManager {
  private static currentScene: Container;
  private static stage: Container;

  public static init(stage: Container): void {
    this.stage = stage;
  }

  public static changeScene(newScene: Container): void {
    if (this.currentScene) {
      this.stage.removeChild(this.currentScene);
    }
    this.currentScene = newScene;
    this.stage.addChild(this.currentScene);
  }
}