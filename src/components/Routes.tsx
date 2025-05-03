import React from 'react';
import { observer } from 'mobx-react-lite';
import { Route } from './Route';
import { rootStore } from '../stores/RootStore';

export const Routes: React.FC = observer(() => {
  return (
    <>
      {rootStore.routeStore.routes.map((route) => {
        return (
          <Route
            key={route.id}
            route={route}
          />
        );
      })}
    </>
  );
});
