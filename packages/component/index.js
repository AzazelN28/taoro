/**
 * Registry of components by id.
 *
 * @type {Map<*, Array<Component>>}
 */
const componentsById = new Map()

/**
 * Registry of components by constructor.
 *
 * @type {Map<Function, Array<Component>>}
 */
const componentsByConstructor = new Map()

/**
 * Base class for all components.
 */
export class Component {
  /**
   * Returns all components by id.
   *
   * @returns {Map<*, Array<Component>>}
   */
  static getComponentsById() {
    return componentsById
  }

  /**
   * Returns all components by constructor.
   *
   * @returns {Map<Function, Array<Component>>}
   */
  static getComponentsByConstructor() {
    return componentsByConstructor
  }

  /**
   * Returns all components with the given id.
   *
   * @param {*} id
   * @returns {Array<Component>}
   */
  static findById(id) {
    return componentsById.get(id)
  }

  /**
   * Returns all components with the given constructor.
   *
   * @param {Function} constructor
   * @returns {Array<Component>}
   */
  static findByConstructor(constructor) {
    return componentsByConstructor.get(constructor)
  }

  /**
   * Returns the component with the given id and constructor.
   *
   * @param {*} id
   * @param {Component} constructor
   */
  static findByIdAndConstructor(id, constructor) {
    const components = this.findById(id)
    if (!components) {
      return null
    }
    for (const component of components) {
      if (component.constructor === constructor) {
        return component
      }
    }
    return null
  }

  /**
   * Registers the component with the given id.
   *
   * @param {*} id
   * @param {Component} component
   */
  static registerById(id, component) {
    if (!componentsById.has(id)) {
      componentsById.set(id, new Array())
    }
    const componentRegistry = componentsById.get(id)
    componentRegistry.push(component)
  }

  /**
   * Registers the component with the given constructor.
   *
   * @param {Function} constructor
   * @param {Component} component
   */
  static registerByConstructor(constructor, component) {
    if (!componentsByConstructor.has(constructor)) {
      componentsByConstructor.set(constructor, new Array())
    }
    const componentRegistry = componentsByConstructor.get(constructor)
    componentRegistry.push(component)
  }

  /**
   * Unregisters the component with the given id.
   *
   * @param {*} id
   * @param {Component} component
   */
  static unregisterById(id, component) {
    const componentRegistry = componentsById.get(id)
    componentRegistry.splice(componentRegistry.indexOf(component), 1)
  }

  /**
   * Unregisters the component with the given constructor.
   *
   * @param {Function} constructor
   * @param {Component} component
   */
  static unregisterByConstructor(constructor, component) {
    const componentRegistry = componentsByConstructor.get(constructor)
    componentRegistry.splice(componentRegistry.indexOf(component), 1)
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
    Component.registerById(this.#id, this)
    Component.registerByConstructor(this.constructor, this)
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
    Component.unregisterById(this.#id, this)
    Component.unregisterByConstructor(this.constructor, this)
  }
}

export default Component
