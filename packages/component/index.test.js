import { describe, test, expect } from 'vitest'
import { Component } from './index'

describe('Component', () => {
  test('find components', () => {
    const component = new Component('test')
    expect(Component.findById('test')).toStrictEqual([component])
    expect(Component.findByConstructor(Component, Component)).toStrictEqual([component])
    expect(Component.findByIdAndConstructor('test', Component)).toBe(component)
    component.unregister()
    expect(Component.findById('test')).toStrictEqual([])
    expect(Component.findByConstructor(Component, Component)).toStrictEqual([])
    expect(Component.findByIdAndConstructor('test', Component)).toBe(null)
  })
})
