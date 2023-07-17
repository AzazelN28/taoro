export class Scheduler {
  #tasks = new Set()

  update() {
    for (const task of this.#tasks) {
      const result = task.next()
      if (result.done) {
        this.#tasks.delete(task)
      }
    }
  }

  clear() {
    this.#tasks.clear()
  }

  has(task) {
    return this.#tasks.has(task)
  }

  add(task) {
    if (!(Symbol.iterator in task)) {
      throw new TypeError('Task is not iterable')
    }
    this.#tasks.add(task)
  }

  delete(task) {
    this.#tasks.delete(task)
  }
}

export default Scheduler
