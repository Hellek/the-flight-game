import { describe, expect, it } from 'vitest'
import { DIContainer, rootContainer, scopeToLifecycle } from '../container'
import { scope } from '../scopeDecorators'

@scope.transient()
class Foo {
  id = Math.random()
}

describe('DIContainer', () => {
  it('rootContainer is a DIContainer', () => {
    expect(rootContainer).toBeInstanceOf(DIContainer)
    expect(rootContainer.container).toBeDefined()
  })

  it('resolve returns instance from Tsyringe container', () => {
    const a = rootContainer.resolve(Foo)
    const b = rootContainer.resolve(Foo)
    expect(a).toBeInstanceOf(Foo)
    expect(b).toBeInstanceOf(Foo)
    // Transient by default: different instances
    expect(a.id).not.toBe(b.id)
  })

  it('child creates child container and returns same instance for same name', () => {
    const child1 = rootContainer.child('test-child')
    const child2 = rootContainer.child('test-child')
    expect(child1).toBe(child2)
    expect(child1).toBeInstanceOf(DIContainer)
  })

  it('childrenExists returns true after child created', () => {
    const name = 'child-' + Math.random()
    expect(rootContainer.childrenExists(name)).toBe(false)
    rootContainer.child(name)
    expect(rootContainer.childrenExists(name)).toBe(true)
  })

  it('child container resolve is isolated (transient in child)', () => {
    const child = rootContainer.child('isolated-' + Math.random())
    const a = child.resolve(Foo)
    const b = child.resolve(Foo)
    expect(a).not.toBe(b)
  })

  it('destroy clears children and prevents further resolve', () => {
    const parent = new DIContainer(null, 'destroy-test')
    const childContainer = parent.child('c1')
    expect(childContainer).toBeInstanceOf(DIContainer)
    parent.resolve(Foo)
    parent.destroy()
    expect(() => parent.resolve(Foo)).toThrow(/destroyed/)
    expect(() => parent.child('c2')).toThrow(/destroyed/)
  })

  it('destroy on child does not affect parent', () => {
    const parent = rootContainer.child('parent-' + Math.random())
    const childContainer = parent.child('child-' + Math.random())
    childContainer.destroy()
    expect(() => parent.resolve(Foo)).not.toThrow()
  })
})

describe('scopeToLifecycle', () => {
  it('is exported and returns Lifecycle enum', () => {
    expect(typeof scopeToLifecycle('TRANSIENT')).toBe('number')
  })
})
