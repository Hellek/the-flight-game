import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  destroy,
  init,
  Props,
  scope,
} from '@core/di';
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

  describe('model with Props in constructor', () => {
    it('passes provider props into model via Props.current', () => {
      @scope.transient()
      class ModelWithProps {
        constructor(public readonly props: Props<{ id: string }>) {}

        get id(): string {
          return this.props.current.id;
        }
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithProps);

      function Consumer() {
        const model = useM();
        return <span data-testid="props-current-id">{model.id}</span>;
      }

      render(
        <DIProvider instance={rootContainer}>
          <P id="first">
            <Consumer />
          </P>
        </DIProvider>,
      );
      expect(screen.getByTestId('props-current-id').textContent).toBe('first');
    });

    it('calls updateProps and updates props.current when provider props change', async () => {
      const updatePropsFn = vi.fn();
      @scope.transient()
      class ModelWithProps {
        constructor(public readonly props: Props<{ id: string }>) {}

        get id(): string {
          return this.props.current.id;
        }

        updateProps = updatePropsFn;
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithProps);

      function Consumer() {
        const model = useM();
        return <span data-testid="props-update-id">{model.id}</span>;
      }

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="first">
            <Consumer />
          </P>
        </DIProvider>,
      );

      expect(screen.getByTestId('props-update-id').textContent).toBe('first');

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="second">
            <Consumer />
          </P>
        </DIProvider>,
      );
      await waitFor(() => {
        expect(updatePropsFn).toHaveBeenCalledWith(expect.objectContaining({ id: 'second' }));
      });
    });
  });

  describe('initInEffect', () => {
    it('calls [init] when initInEffect is true (default)', async () => {
      const initFn = vi.fn();
      @scope.transient()
      class ModelWithInit {
        [init] = initFn;
        value = 0;
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithInit);

      function Consumer() {
        useM();
        return null;
      }

      render(
        <DIProvider instance={rootContainer}>
          <P>
            <Consumer />
          </P>
        </DIProvider>,
      );
      await waitFor(() => {
        expect(initFn).toHaveBeenCalled();
      });
    });

    it('calls [init] when initInEffect is false', async () => {
      const initFn = vi.fn();
      @scope.transient()
      class ModelWithInit {
        [init] = initFn;
        value = 0;
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithInit, { initInEffect: false });

      function Consumer() {
        useM();
        return null;
      }

      render(
        <DIProvider instance={rootContainer}>
          <P>
            <Consumer />
          </P>
        </DIProvider>,
      );
      await waitFor(() => {
        expect(initFn).toHaveBeenCalled();
      });
    });
  });
});
