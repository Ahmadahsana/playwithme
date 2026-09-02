// Runs the chess search off the main thread so the board stays responsive.
import { findBestMove, type GameState, type SearchOptions } from './engine'

interface Request { id: number; state: GameState; options?: SearchOptions }

self.onmessage = (e: MessageEvent<Request>) => {
  const { id, state, options } = e.data
  const result = findBestMove(state, options)
  self.postMessage({ id, result })
}
