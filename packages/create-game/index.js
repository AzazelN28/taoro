import fs from 'node:fs'
import path from 'node:path'

function getPackage(options) {
const packageTemplate = `{
  "packageName": "${options?.packageName ?? 'packageName'}",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^4.4.0"
  },
  "dependencies": {
    "@taoro/component": "workspace:^",
    "@taoro/component-transform-2d": "workspace:^",
    "@taoro/game": "workspace:^",
    "@taoro/input": "workspace:^",
    "@taoro/math-point": "workspace:^",
    "@taoro/math-rect": "workspace:^",
    "@taoro/recorder": "workspace:^",
    "@taoro/renderer-2d": "workspace:^"
  }
}`
  return packageTemplate
}

function getHTML() {
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/javascript.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Taoro Game</title>
  </head>
  <body>
    <div id="game">
      <canvas></canvas>
    </div>
    <!--
        We need user gesture to start the game because
        AudioContext and other APIs require it.
      -->
    <div id="user-gesture" class="overlay">
      <svg class="play" width="256" height="256" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30"></circle>
        <path d="M 24,20 48,32 24,44 Z"></path>
      </svg>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>`
}

async function main() {

  const args = process.argv.slice(2)
  try {
    const packageName = args[0]
    await fs.promises.mkdir(packageName, { recursive: true })
    await fs.promises.writeFile(path.resolve(packageName, 'package.json'), getPackage({ packageName }), 'utf-8')
  } catch (error) {
    console.error(error)
  }

}

main()

