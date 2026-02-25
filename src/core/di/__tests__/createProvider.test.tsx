import { observer } from 'mobx-react-lite';
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

const Consumer = observer(function Consumer() {
  const model = useTestModel();
  return <span data-testid="value">{model.value}</span>;
});

describe('createProvider', () => {
  it('useModel throws without provider', () => {
    const BadConsumer = observer(function BadConsumer() {
      useTestModel();
      return null;
    });

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

    const ConsumerWithRef = observer(function ConsumerWithRef() {
      modelRef.current = useTestModel();
      return <span data-testid="value">{modelRef.current.value}</span>;
    });

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

    const View = observer(function View() {
      useM();
      return null;
    });

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

      const Consumer = observer(function Consumer() {
        const model = useM();
        return <span data-testid="props-current-id">{model.id}</span>;
      });

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

      const Consumer = observer(function Consumer() {
        const model = useM();
        return <span data-testid="props-update-id">{model.id}</span>;
      });

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
      expect(screen.getByTestId('props-update-id').textContent).toBe('second');
    });

    it('keeps props.current in sync with provider on rerender (same instance, no remount)', async () => {
      @scope.transient()
      class ModelWithProps {
        constructor(public readonly props: Props<{ id: string }>) {}

        get id(): string {
          return this.props.current.id;
        }
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithProps);
      const instanceRef = { current: null as InstanceType<typeof ModelWithProps> | null };

      const Consumer = observer(function Consumer() {
        const model = useM() as InstanceType<typeof ModelWithProps>;
        instanceRef.current = model;
        return <span data-testid="sync-id">{model.id}</span>;
      });

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="a">
            <Consumer />
          </P>
        </DIProvider>,
      );

      expect(screen.getByTestId('sync-id').textContent).toBe('a');
      const instanceA = instanceRef.current;

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="b">
            <Consumer />
          </P>
        </DIProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId('sync-id').textContent).toBe('b');
      });
      expect(instanceRef.current).toBe(instanceA);
      expect(instanceRef.current?.props.current.id).toBe('b');
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

      const Consumer = observer(function Consumer() {
        useM();
        return null;
      });

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

      const Consumer = observer(function Consumer() {
        useM();
        return null;
      });

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

  describe('complex scenarios: race conditions, edge cases, no cycles', () => {
    it('rapid successive prop changes: final props and UI match last render (no stale closure)', async () => {
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

      const Consumer = observer(function Consumer() {
        const model = useM();
        return <span data-testid="rapid-id">{model.id}</span>;
      });

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="a">
            <Consumer />
          </P>
        </DIProvider>,
      );

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="b">
            <Consumer />
          </P>
        </DIProvider>,
      );
      rerender(
        <DIProvider instance={rootContainer}>
          <P id="c">
            <Consumer />
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('rapid-id').textContent).toBe('c');
      });
      const lastCall = updatePropsFn.mock.calls[updatePropsFn.mock.calls.length - 1];
      expect(lastCall[0]).toMatchObject({ id: 'c' });
    });

    it('unmount before props effect runs: no throw, destroy called', async () => {
      const destroyFn = vi.fn();
      const updatePropsFn = vi.fn();
      @scope.transient()
      class ModelWithLifecycle {
        constructor(public readonly props: Props<{ id: string }>) {}

        [destroy] = destroyFn;
        updateProps = updatePropsFn;
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithLifecycle);

      const Consumer = observer(function Consumer() {
        const model = useM();
        return <span data-testid="unmount-race">{model.props.current.id}</span>;
      });

      const { unmount, rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="first">
            <Consumer />
          </P>
        </DIProvider>,
      );

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="second">
            <Consumer />
          </P>
        </DIProvider>,
      );
      unmount();

      await waitFor(() => {
        expect(destroyFn).toHaveBeenCalled();
      });
      expect(() => unmount()).not.toThrow();
    });

    it('nested providers of same type: inner consumer gets inner model and inner props', async () => {
      @scope.transient()
      class ModelWithProps {
        constructor(public readonly props: Props<{ id: string }>) {}

        get id(): string {
          return this.props.current.id;
        }
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithProps);

      const InnerConsumer = observer(function InnerConsumer() {
        const model = useM();
        return <span data-testid="inner">{model.id}</span>;
      });

      const OuterConsumer = observer(function OuterConsumer() {
        const model = useM();
        return <span data-testid="outer">{model.id}</span>;
      });

      render(
        <DIProvider instance={rootContainer}>
          <P id="outer">
            <OuterConsumer />
            <P id="inner">
              <InnerConsumer />
            </P>
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('outer').textContent).toBe('outer');
        expect(screen.getByTestId('inner').textContent).toBe('inner');
      });
    });

    it('props keys removed when not in next set: current does not keep stale keys', async () => {
      @scope.transient()
      class ModelWithOptional {
        constructor(public readonly props: Props<{ id: string; opt?: number }>) {}

        get id(): string {
          return this.props.current.id;
        }

        get opt(): number | undefined {
          return this.props.current.opt;
        }
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithOptional);
      const instanceRef = { current: null as InstanceType<typeof ModelWithOptional> | null };

      const Consumer = observer(function Consumer() {
        const model = useM() as InstanceType<typeof ModelWithOptional>;
        instanceRef.current = model;
        return (
          <>
            <span data-testid="opt-id">{model.id}</span>
            <span data-testid="opt-opt">{String(model.opt)}</span>
          </>
        );
      });

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="x">
            <Consumer />
          </P>
        </DIProvider>,
      );

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="y" opt={1}>
            <Consumer />
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('opt-id').textContent).toBe('y');
        expect(screen.getByTestId('opt-opt').textContent).toBe('1');
      });

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="z">
            <Consumer />
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('opt-id').textContent).toBe('z');
        expect(instanceRef.current?.props.current).not.toHaveProperty('opt');
      });
    });

    it('multiple observers under one provider: all see same model and updated props', async () => {
      @scope.transient()
      class ModelWithProps {
        constructor(public readonly props: Props<{ id: string }>) {}

        get id(): string {
          return this.props.current.id;
        }
      }
      const { Provider: P, useModel: useM } = createProvider(ModelWithProps);
      type M = InstanceType<typeof ModelWithProps>;
      const refs = { a: null as M | null, b: null as M | null };

      const ConsumerA = observer(function ConsumerA() {
        const model = useM() as InstanceType<typeof ModelWithProps>;
        refs.a = model;
        return <span data-testid="multi-a">{model.id}</span>;
      });

      const ConsumerB = observer(function ConsumerB() {
        const model = useM() as InstanceType<typeof ModelWithProps>;
        refs.b = model;
        return <span data-testid="multi-b">{model.id}</span>;
      });

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="one">
            <ConsumerA />
            <ConsumerB />
          </P>
        </DIProvider>,
      );

      expect(refs.a).toBe(refs.b);
      expect(screen.getByTestId('multi-a').textContent).toBe('one');
      expect(screen.getByTestId('multi-b').textContent).toBe('one');

      rerender(
        <DIProvider instance={rootContainer}>
          <P id="two">
            <ConsumerA />
            <ConsumerB />
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('multi-a').textContent).toBe('two');
        expect(screen.getByTestId('multi-b').textContent).toBe('two');
      });
      expect(refs.a?.props.current.id).toBe('two');
      expect(refs.b?.props.current.id).toBe('two');
    });

    it('rerender with same shallow-equal props: updateProps not called again (no loop)', async () => {
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

      const Consumer = observer(function Consumer() {
        const model = useM();
        return <span data-testid="same-props">{model.id}</span>;
      });

      const sameProps = { id: 'same' };

      const { rerender } = render(
        <DIProvider instance={rootContainer}>
          <P id="same">
            <Consumer />
          </P>
        </DIProvider>,
      );

      const countAfterMount = updatePropsFn.mock.calls.length;

      rerender(
        <DIProvider instance={rootContainer}>
          <P {...sameProps}>
            <Consumer />
          </P>
        </DIProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('same-props').textContent).toBe('same');
      });

      expect(updatePropsFn).toHaveBeenCalledTimes(countAfterMount);
    });
  });
});
