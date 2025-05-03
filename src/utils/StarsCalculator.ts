type Level = {
  waveEnemyCount: number
}

export class StarsCalculator {
  static calculate(
    level: { waveEnemyCount: number },
    timeLeft: number,
    killCount: number
  ): number {
    const scoreRatio = killCount / level.waveEnemyCount

    if (scoreRatio >= 0.9 && timeLeft > 15) {
      return 3
    } else if (scoreRatio >= 0.6 && timeLeft > 5) {
      return 2
    } else if (scoreRatio >= 0.3) {
      return 1
    } else {
      return 0
    }
  }
}
