import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { destroy, init, scope } from '@core/di';
import { render, screen, waitFor } from '@testing-library/react';
import { rootContainer } from '../container';
import { DIProvider } from '../ContainerContext';
import { createProvider } from '../createProvider';

@scope.transient()
class TestModel {
  [init] = vi.fn();
  updateProps = vi.fn();
  value = 0;
}

const { Provider: TestProvider, useModel: useTestModel } = createProvider(TestModel);

function Consumer() {
  const model = useTestModel();
  return <span data-testid="value">{model.value}</span>;
}

describe('createProvider', () => {
  it('useModel throws without provider', () => {
    function BadConsumer() {
      useTestModel();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(/no provider found/);
  });

  it('Provider resolves model and useModel returns it', () => {
    render(
      <DIProvider instance={rootContainer}>
        <TestProvider>
          <Consumer />
        </TestProvider>
      </DIProvider>,
    );
    expect(screen.getByTestId('value').textContent).toBe('0');
  });

  it('calls init with props after mount', async () => {
    const props = { foo: 'bar' };
    const modelRef = { current: null as TestModel | null };

    function ConsumerWithRef() {
      modelRef.current = useTestModel();
      return <span data-testid="value">{modelRef.current.value}</span>;
    }

    render(
      <DIProvider instance={rootContainer}>
        <TestProvider {...props}>
          <ConsumerWithRef />
        </TestProvider>
      </DIProvider>,
    );
    await waitFor(() => {
      expect((modelRef.current as unknown as { [init]: ReturnType<typeof vi.fn> })?.[init]).toHaveBeenCalledWith(props);
    });
  });

  it('unmount does not throw', () => {
    const { unmount } = render(
      <DIProvider instance={rootContainer}>
        <TestProvider>
          <Consumer />
        </TestProvider>
      </DIProvider>,
    );

    expect(() => unmount()).not.toThrow();
  });

  it('calls [destroy] on model when provider unmounts', async () => {
    const destroyFn = vi.fn();
    @scope.transient()
    class ModelWithDestroy {
      [init] = vi.fn();
      [destroy] = destroyFn;
      value = 0;
    }
    const { Provider: P, useModel: useM } = createProvider(ModelWithDestroy);

    const View = () => {
      useM();
      return null;
    };

    const { unmount } = render(
      <DIProvider instance={rootContainer}>
        <P>
          <View />
        </P>
      </DIProvider>,
    );

    unmount();
    await waitFor(() => {
      // cleanup в useEffect вызывается при unmount; в Strict Mode может быть 2 вызова
      expect(destroyFn).toHaveBeenCalled();
    });
  });

  describe('onlyTransient', () => {
    it('throws when model is @scope.container() and onlyTransient is true (default)', () => {
      @scope.container()
      class ContainerModel {
        value = 0;
      }
      expect(() => createProvider(ContainerModel)).toThrow(
        /ViewModel must be @scope.transient|only TRANSIENT/,
      );
    });

    it('throws when model is @scope.singleton() and onlyTransient is true', () => {
      @scope.singleton()
      class SingletonModel {
        value = 0;
      }
      expect(() => createProvider(SingletonModel)).toThrow(
        /ViewModel must be @scope.transient|only TRANSIENT/,
      );
    });

    it('does not throw when onlyTransient is false and model is container-scoped', () => {
      @scope.container()
      class ContainerModel {
        value = 0;
      }
      expect(() => createProvider(ContainerModel, { onlyTransient: false })).not.toThrow();
    });
  });
});
