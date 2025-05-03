import { Enemy } from './Enemy'
import { GameScene } from '../scenes/GameScene'

export class EnemySpawner {
  constructor(private scene: GameScene) {}

  spawnEnemy() {
    const { spawnPositions, waveEnemyCount, speedRange } =
      this.scene.currentLevel
    const isFirstLevel = this.scene.currentLevel.id === 1
    const maxSpawns = isFirstLevel
      ? Math.ceil(waveEnemyCount * 0.5)
      : waveEnemyCount

    for (let i = 0; i < maxSpawns; i++) {
      const progress =
        (this.scene.currentLevel.duration - this.scene.timeLeft) /
        this.scene.currentLevel.duration

      const isSuper =
        Math.random() < 0.1 + 0.15 * progress && this.scene.superEnemyCount < 15

      let speed =
        Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0]

      if (isSuper) {
        this.scene.superEnemyCount++
        speed *= 1.5
      }

      const y = isSuper
        ? spawnPositions[
            Math.floor(Math.random() * Math.ceil(spawnPositions.length / 2))
          ]
        : spawnPositions[Math.floor(Math.random() * spawnPositions.length)]

      const direction = Math.random() < 0.5 ? 'left' : 'right'
      const x = direction === 'left' ? -100 : window.innerWidth + 100

      const enemy = new Enemy(x, y, isSuper)
      enemy.setGameScene(this.scene)
      enemy.setSpeed(direction === 'left' ? speed : -speed)

      if (isSuper) {
        enemy.tint = 0xffcc00
        enemy.scale.set(0.6)
      }

      const scoreValue = isSuper ? 25 : 10
      const onEnemyKilled = () => {
        if (this.scene.isPaused) return
        this.scene.killCount += scoreValue
        if (this.scene.killsText) {
          this.scene.killsText.text = `Score: ${this.scene.killCount}`
        }
        this.scene.showFloatingText(`+${scoreValue}`, enemy.x, enemy.y)
      }

      enemy.once('pointerdown', onEnemyKilled)
      enemy.on('killed', () => {
        if (this.scene.isPaused) return
        // prevent duplicate score
      })

      this.scene.enemies.push(enemy)
      this.scene.addChild(enemy)
    }
  }
}
