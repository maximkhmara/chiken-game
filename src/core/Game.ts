import { autoDetectRenderer, Container, Ticker, Renderer } from 'pixi.js'
import { SceneManager } from './SceneManager'
import { MainMenu } from '../scenes/MainMenu'
import { LoadingScene } from '../scenes/LoadingScene'

export class Game {
  private renderer!: Renderer
  private stage!: Container
  private ticker!: Ticker

  public async init(): Promise<void> {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    this.renderer = await autoDetectRenderer({
      view: canvas,
      width: 800,
      height: 600,
      backgroundColor: 0x7ba722
    })

    this.renderer.resize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', () => {
      this.renderer.resize(window.innerWidth, window.innerHeight)
    })

    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.margin = '0'
    canvas.style.padding = '0'
    canvas.style.border = '0'
    canvas.style.outline = 'none'
    canvas.style.display = 'block'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'

    this.stage = new Container()

    this.ticker = new Ticker()
    this.ticker.add(() => {
      this.renderer.render(this.stage)
    })
    this.ticker.start()

    SceneManager.init(this.stage)
    SceneManager.changeScene(
      new LoadingScene(() => {
        SceneManager.changeScene(new MainMenu())
      })
    )
  }
  public get app() {
    return {
      renderer: this.renderer,
      stage: this.stage
    }
  }
}
