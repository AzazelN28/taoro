# Scheduler System

Simple scheduling system using generator functions and iterators as tasks.

```javascript
const scheduler = new Scheduler()

function * Task() {
  // This task will run forever without blocking
  // the main thread.
  while (true) {
    yield
  }
}

scheduler.add(Task())

// Run all tasks every 1 second.
setInterval(() => scheduler.update(), 1000)
```

