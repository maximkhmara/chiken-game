// src/index.ts
import { Game } from './core/Game'

window.addEventListener('DOMContentLoaded', async () => {
  const game = new Game()
  await game.init()
  // @ts-ignore
  ;(window as any).__PIXI_DEVTOOLS__ = {
    app: game.app
  }
})
