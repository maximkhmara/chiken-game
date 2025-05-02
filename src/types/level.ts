export interface Level {
  id: number;
  enemyCount: number;
  duration: number;
  spawnInterval: number;
  spawnPositions: number[];
}

export interface LevelConfig {
  levels: Level[];
}