import { TransformComponent } from '@taoro/component-transform-2d'
import { TextComponent } from "@taoro/renderer-2d"

export function* Score(game, score) {
  const leftTransform = new TransformComponent('left-score', {
    y: 20,
  })
  const leftText = new TextComponent('left-score', {
    font: '64px bitwise',
    textAlign: 'center',
    text: () => score.left,
  })

  const rightTransform = new TransformComponent('right-score', {
    y: 20,
  })
  const rightText = new TextComponent('right-score', {
    font: '64px bitwise',
    textAlign: 'center',
    text: () => score.right,
  })

  while (true) {
    leftTransform.position.x = game.viewport.currentHalfWidth - 100
    rightTransform.position.x = game.viewport.currentHalfWidth + 100
    yield
  }
}

export default Score
