# Architecture

Taoro is divided into multiple exchangeable parts. A Taoro Game consists of a few systems grouped by categories, a `Loop`, a `Scheduler` and a `Pipeline`:

The `Loop` is the main object in charge of iterate through all the `Pipeline` functions. The `Scheduler` is responsible for iterating through `Task`s (these are usually found in the `entities` folder and in the `tasks` folder).

The order of execution in the default pipeline is the following:

1. Update frame counter
2. Update the viewport, the `<canvas>` element were all the game should be rendered.
3. Update the input state: keyboard, mouse, pointer, touch, gamepads, etc.
4. Update the scheduler, iterating through all the scheduled tasks.
5. Update the video (using a renderer).
6. Update the audio.
7. Request next animation frame.

## Entity Component System (ECS)

Taoro implements ECS following these few rules:

- **Entities**: are just an identifier that identifies entities. A valid id can be anyhing, a `string`, a `number`, a `Symbol` or even an object.
- **Components**: are serializable objects that contains all the properties that an entity can hold and links them to a system. For example: an entity can have an `AudioEmitterComponent` so it emits spatial audio in 3D, but also can have a `SpriteComponent` that holds it's graphical representation, and also can have a `ColliderComponent` so it collides with the environment and other objects.
- **Systems**: a system handles all _low-level_ operations. They're responsible for detecting collisions, communicating with the browser APIs and holding component resources.

As explained before, there are also some other parts of the system that tie everything together:

- **Loop**: responsible for iterating through systems and updating them.
- **Scheduler**: responsible for iterating through tasks.
- **Pipeline**: responsible for keeping the systems execution order.

When you create a game in Taoro, a `Loop`, a `Pipeline`, and a `Scheduler` are created along with all of these other systems:

```javascript
class Game {

  // ...

  constructor(canvas, options = {}) {
    if (options?.globalThis ?? true) {
      globalThis.game = this
    }
    this.#canvas = canvas
    this.#pipeline = [
      (currentTime) => this.#frameCounter.update(currentTime),
      () => this.#viewport.update(),
      () => this.#input.update(),
      () => this.#scheduler.update(),
    ]
    this.#loop = new Loop(this.#pipeline)
    this.#input = new Input()
    this.#audio = new Audio()
    this.#sound = new Sound(this.#audio)
    this.#music = new Music(this.#audio)
    this.#frameCounter = new FrameCounter()
    this.#viewport = new Viewport(this.#canvas)
    this.#scheduler = new Scheduler()
    this.#resources = new Resources(options?.baseURL ?? location.href)
    this.#systems = [
      this.#input,
      this.#audio,
      this.#viewport,
      this.#scheduler,
      this.#loop
    ]
  }

  // ...
}
```
