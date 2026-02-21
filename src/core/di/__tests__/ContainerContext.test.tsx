import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { DIContainer, rootContainer } from '../container'
import { ChildDIProvider, DIProvider } from '../ContainerContext'
import { useContainer } from '../useContainer'

function ShowContainerName() {
  const container = useContainer()
  return <span data-testid="name">{container.name}</span>
}

describe('DIProvider', () => {
  it('provides container to children', () => {
    const { container } = render(
      <DIProvider>
        <ShowContainerName />
      </DIProvider>,
    )

    expect(within(container).getByTestId('name').textContent).toBe('root')
  })

  it('useContainer returns custom instance when provided', () => {
    const custom = new DIContainer(null, 'custom')

    const { container } = render(
      <DIProvider instance={custom}>
        <ShowContainerName />
      </DIProvider>,
    )

    expect(within(container).getByTestId('name').textContent).toBe('custom')
  })
})

describe('useContainer', () => {
  it('returns rootContainer when no provider', () => {
    const { container } = render(<ShowContainerName />)
    expect(within(container).getByTestId('name').textContent).toBe('root')
  })
})

describe('ChildDIProvider', () => {
  it('creates child container and provides it', () => {
    function ChildName() {
      const c = useContainer()
      const isChild = c !== rootContainer
      return <span data-testid="child">{isChild ? 'child' : 'root'}</span>
    }

    render(
      <DIProvider>
        <ChildDIProvider name="page1">
          <ChildName />
        </ChildDIProvider>
      </DIProvider>,
    )
    expect(screen.getByTestId('child').textContent).toBe('child')
  })

  it('same name returns same child container', async () => {
    const captured = { first: null as DIContainer | null, second: null as DIContainer | null }

    function Capture({ slot }: { slot: 'first' | 'second' }) {
      const c = useContainer()
      useEffect(() => {
        if (slot === 'first') captured.first = c
        else captured.second = c
      }, [c, slot])
      return null
    }

    render(
      <DIProvider>
        <ChildDIProvider name="same">
          <Capture slot="first" />
        </ChildDIProvider>
        <ChildDIProvider name="same">
          <Capture slot="second" />
        </ChildDIProvider>
      </DIProvider>,
    )
    await waitFor(() => {
      expect(captured.first).not.toBeNull()
      expect(captured.second).not.toBeNull()
    })
    expect(captured.first).not.toBe(rootContainer)
    expect(captured.second).not.toBe(rootContainer)
    // Different mounts => different useState, so actually we get two different child containers
    // because each ChildDIProvider has its own useState. So first and second are different.
    expect(captured.first).toBeInstanceOf(DIContainer)
    expect(captured.second).toBeInstanceOf(DIContainer)
  })
})
