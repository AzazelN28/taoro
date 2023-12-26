#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import minimist from 'minimist'

function templateResolve(...paths) {
  return path.resolve(path.dirname(process.argv[1]), ...paths)
}

async function templatePackage(dstPath, options) {
  const content = await fs.promises.readFile(templateResolve('template', 'package.json'), 'utf-8')
  const pkg = JSON.parse(content)
  pkg.name = options.name
  await fs.promises.writeFile(dstPath, JSON.stringify(pkg, null, 2), 'utf-8')
}

async function templateHTML(dstPath, options) {
  const content = await fs.promises.readFile(templateResolve('template', 'index.html'), 'utf-8')
  await fs.promises.writeFile(dstPath, content)
}

async function templateCopyFile(dstPath) {
  const file = path.basename(dstPath)
  await fs.promises.mkdir(path.dirname(dstPath), { recursive: true })
  await fs.promises.copyFile(templateResolve('template', file), dstPath)
}

async function templateCreateDirectory(dstPath) {
  await fs.promises.mkdir(dstPath, { recursive: true })
}

async function main() {
  console.log(process.argv[0])
  console.log(process.argv[1])
  const args = process.argv.slice(2)
  const packageName = args[0]
  await fs.promises.mkdir(packageName, { recursive: true })
  await templatePackage(path.resolve(packageName, 'package.json'), { name: packageName })
  await templateCreateDirectory(path.resolve(packageName, 'entities'))
  await templateHTML(path.resolve(packageName, 'index.html'), { name: packageName })
  await templateCopyFile(path.resolve(packageName, 'public', 'javascript.svg'))
  await templateCopyFile(path.resolve(packageName, 'main.js'))
  await templateCopyFile(path.resolve(packageName, 'style.css'))
  await templateCopyFile(path.resolve(packageName, 'README.md'))
  await templateCopyFile(path.resolve(packageName, '.editorconfig'))
  await templateCopyFile(path.resolve(packageName, '.prettierrc'))
}

main()

