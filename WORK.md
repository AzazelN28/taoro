# TO DO

- [ ] Add a way to keep up the input time between presses.
- [ ] Add a way to detect collisions in tile-based games.
~~- [ ] Rename `collider-nano-2d` to `collider-multiple-rect-2d`.~~
~~- [ ] Restore old `collider-nano-2d` and call it `collider-single-rect-2d`~~
- [ ] Collider should support multiple geometric methods?
- [ ] Move `getAs` functions out of `resource-loader` and move it to something like `resource`.

# Ideas

## 1. Add a tile-based collider system

Add a Collider System for tile-based games so we can do something like this.

```javascript
class Collider {
  update() {
    // detect collisions...
  }
}

class ColliderComponent extends Component {
  constructor() {
    this.#tile = new Point()
  }

  get tile() {
    return this.#tile
  }
}
```
