export interface Level {
  id: number
  waveEnemyCount: number
  duration: number
  spawnInterval: number
  spawnPositions: number[]
  speedRange: [number, number]
  stars: {
    '20': number
    '40': number
    '60': number
  }
}

export interface LevelConfig {
  levels: Level[]
}
