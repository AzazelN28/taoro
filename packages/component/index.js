/**
 * Base class for all components.
 */
export class Component {
  /**
   * Registry of components by id.
   *
   * @type {Map<*, Array<Component>>}
   */
  static #componentsById = new Map()

  /**
   * Registry of components by constructor.
   *
   * @type {Map<Function, Array<Component>>}
   */
  static #componentsByConstructor = new Map()

  /**
   * Creates a unique id.
   *
   * @param {string} prefix
   * @returns {string}
   */
  static createId(prefix = '') {
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)
    if (prefix) {
      return `${prefix}-${id}`
    }
    return id
  }

  /**
   * Returns all components by id.
   *
   * @returns {Map<*, Array<Component>>}
   */
  static getComponentsById() {
    return this.#componentsById
  }

  /**
   * Returns all components by constructor.
   *
   * @returns {Map<Function, Array<Component>>}
   */
  static getComponentsByConstructor() {
    return this.#componentsByConstructor
  }

  /**
   * Returns all components with the given id.
   *
   * @param {*} id
   * @returns {Array<Component>}
   */
  static findById(id) {
    return this.#componentsById.get(id)
  }

  /**
   * Returns all components with the given constructor.
   *
   * @param {Function} constructor
   * @returns {Array<Component>}
   */
  static findByConstructor(constructor) {
    return this.#componentsByConstructor.get(constructor)
  }

  /**
   * Returns the component with the given id and constructor.
   *
   * @param {*} id
   * @param {Component} constructor
   */
  static findByIdAndConstructor(id, constructor) {
    const components = this.findByConstructor(constructor)
    if (!components) {
      return null
    }
    return components.find((component) => component.id === id) ?? null
  }

  /**
   * Registers the component with the given id.
   *
   * @param {Component} component
   * @param {*} [id]
   */
  static registerById(component, id = component.id) {
    if (!this.#componentsById.has(id)) {
      this.#componentsById.set(id, new Array())
    }
    const componentRegistry = this.#componentsById.get(id)
    componentRegistry.push(component)
  }

  /**
   * Registers the component with the given constructor.
   *
   * @param {Component} component
   * @param {Function} [constructor]
   */
  static registerByConstructor(component, constructor = component.constructor) {
    if (!this.#componentsByConstructor.has(constructor)) {
      this.#componentsByConstructor.set(constructor, new Array())
    }
    const componentRegistry = this.#componentsByConstructor.get(constructor)
    componentRegistry.push(component)
  }

  /**
   * Registers the component.
   *
   * @param {Component} component
   * @param {Function} [constructor]
   * @param {*} [id]
   */
  static register(component, constructor, id) {
    this.registerById(component, id)
    this.registerByConstructor(component, constructor)
  }

  /**
   * Unregisters the component with the given id.
   *
   * @param {Component} component
   */
  static unregisterById(component) {
    const id = component.id
    const componentRegistry = this.#componentsById.get(id)
    const index = componentRegistry.indexOf(component)
    if (index < 0) {
      throw new Error('Component not found')
    }
    const [removed] = componentRegistry.splice(index, 1)
    return removed
  }

  /**
   * Unregisters the component with the given constructor.
   *
   * @param {Component} component
   */
  static unregisterByConstructor(component) {
    const constructor = component.constructor
    const componentRegistry = this.#componentsByConstructor.get(constructor)
    const index = componentRegistry.indexOf(component)
    if (index < 0) {
      throw new Error('Component not found')
    }
    const [removed] = componentRegistry.splice(index, 1)
    return removed
  }

  /**
   * Unregisters component
   *
   * @param {Component} component
   */
  static unregister(component) {
    this.unregisterById(component)
    this.unregisterByConstructor(component)
  }

  /**
   * Unregisters all components.
   *
   * @param  {...any} components
   */
  static unregisterAll(...components) {
    for (const component of components) {
      component.unregister()
    }
  }

  /**
   * Unregisters all components with the given id.
   *
   * @param {*} id
   */
  static unregisterAllById(id) {
    this.#componentsById.get(id).forEach(component => component.unregister())
  }

  /**
   * Entity id.
   *
   * @type {*}
   */
  #id = null

  /**
   * Constructor.
   *
   * @param {*} id Id of the entity associated with this component.
   */
  constructor(id) {
    this.#id = id
    Component.register(this)
  }

  /**
   * Returns the id of the entity associated with this component.
   *
   * @type {*}
   */
  get id() {
    return this.#id
  }

  /**
   * Unregister this component from the registries. This needs to
   * be called when the entity associated with the component is
   * destroyed.
   */
  unregister() {
    Component.unregister(this)
  }
}

export default Component
