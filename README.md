# Taoro

## Why Taoro?

Taoro is an engine (and set of libraries) for developing web games. The main difference with other frameworks such as Phaser, Construct, etc. is in its 100% modular approach, allowing any user to rewrite any part of the engine. Simplicity first.

The other thing that I think makes Taoro quite unique is the way it implements ECS by using **generator functions** to create "tasks" that serve as glue between entities, components and systems while keeping the code simple and succinct.

Entities are just identifiers, Components are instantiated using those ids and Systems are started, stopped and updated by the core.

Example:

```javascript
export function * Player(game) {
  const transform = new TransformComponent('player')
  const image = new ImageComponent('player', {
    source: game.resources.get('player.png')
  })

  // ... initialize other components ...

  let health = 100

  // task main loop
  while (health > 0) {
    if (game.input.stateOf(0, 'up')) {
      transform.position.y--
    } else if (game.input.stateOf(0, 'down')) {
      transform.position.y++
    }

    // we use yield as a way to interrupt
    // the execution of this task and allow
    // other tasks and other systems to
    // be updated.
    yield
  }

  // when the task is over, we can consider the player
  // entity dead so we can release resources and update other things.

  // ... unregister components ...

  transform.unregister()
  image.unregister()
}

game.scheduler.add(Player(game))

// We can also pass ANY argument to our tasks because
// they're just functions...
game.scheduler.add(Enemy(game, EnemyType.HEAVY, x, y))
```

## Where does the name come from?

Taoro is the name of an old _menceyato_, a type of territorial division used by the natives of [Tenerife](https://es.wikipedia.org/wiki/Tenerife), one of the canary islands. The place where I grew up until I moved to Madrid.

## Previous works

This is heavily based on a previous (discontinued) project called [div.js](https://github.com/AzazelN28/div.js).

## Thanks

A [zardoz89](https://github.com/Zardoz89/), [vii1](https://github.com/vii1/), [panreyes](https://github.com/panreyes/) y a toda la gente del #canaldiv de Discord.

Made with :heart: by [AzazelN28](https://github.com/azazeln28)
