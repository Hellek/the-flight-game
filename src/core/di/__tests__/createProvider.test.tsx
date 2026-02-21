import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { rootContainer } from '../container'
import { DIProvider } from '../ContainerContext'
import { createProvider } from '../createProvider'
import { scope } from '../scopeDecorators'

@scope.transient()
class TestModel {
  init = vi.fn()
  updateProps = vi.fn()
  destroy = vi.fn()
  value = 0
}

const { Provider: TestProvider, useModel: useTestModel } = createProvider(TestModel)

function Consumer() {
  const model = useTestModel()
  return <span data-testid="value">{model.value}</span>
}

describe('createProvider', () => {
  it('useModel throws without provider', () => {
    function BadConsumer() {
      useTestModel()
      return null
    }

    expect(() => render(<BadConsumer />)).toThrow(/no provider found/)
  })

  it('Provider resolves model and useModel returns it', () => {
    render(
      <DIProvider instance={rootContainer}>
        <TestProvider>
          <Consumer />
        </TestProvider>
      </DIProvider>,
    )
    expect(screen.getByTestId('value').textContent).toBe('0')
  })

  it('calls init with props after mount', async () => {
    const props = { foo: 'bar' }
    const modelRef = { current: null as TestModel | null }

    function ConsumerWithRef() {
      modelRef.current = useTestModel()
      return <span data-testid="value">{modelRef.current.value}</span>
    }

    render(
      <DIProvider instance={rootContainer}>
        <TestProvider {...props}>
          <ConsumerWithRef />
        </TestProvider>
      </DIProvider>,
    )
    await waitFor(() => {
      expect(modelRef.current?.init).toHaveBeenCalledWith(props)
    })
  })

  it('unmount does not throw', () => {
    const { unmount } = render(
      <DIProvider instance={rootContainer}>
        <TestProvider>
          <Consumer />
        </TestProvider>
      </DIProvider>,
    )

    expect(() => unmount()).not.toThrow()
  })
})
