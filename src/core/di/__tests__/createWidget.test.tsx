import { observer } from 'mobx-react-lite';
import { describe, expect, it } from 'vitest';
import { scope } from '@core/di';
import { render, screen } from '@testing-library/react';
import { rootContainer } from '../container';
import { DIProvider } from '../ContainerContext';
import { createProvider } from '../createProvider';
import { createWidget } from '../createWidget';

@scope.transient()
class DummyModel {
  label = 'dummy';
  init?(): void;
  updateProps?(): void;
  destroy?(): void;
}

const { Provider: DummyProvider, useModel: useDummyModel } = createProvider(DummyModel);

const DummyView = observer(function DummyView() {
  const model = useDummyModel();
  return <span data-testid="label">{model.label}</span>;
});

DummyView.displayName = 'DummyView';

const DummyWidget = createWidget(DummyProvider, DummyView);

describe('createWidget', () => {
  it('renders Provider and View with props', () => {
    render(
      <DIProvider instance={rootContainer}>
        <DummyWidget />
      </DIProvider>,
    );
    expect(screen.getByTestId('label').textContent).toBe('dummy');
  });

  it('Widget has displayName', () => {
    expect(DummyWidget.displayName).toContain('DummyView');
  });
});
