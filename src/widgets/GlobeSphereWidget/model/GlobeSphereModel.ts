import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import type { ThreeEvent } from '@react-three/fiber';
import { UserEventsService } from '@services';

@scope.transient()
export class GlobeSphereModel {
  constructor(private readonly userEventsService: UserEventsService) {
    makeAutoObservable(this);
  }

  handlePointerMove = (e: ThreeEvent<PointerEvent>): void => {
    const localPoint = e.point.clone();
    e.object.worldToLocal(localPoint);
    this.userEventsService.recordPointerMove(e.nativeEvent, { point: localPoint });
  };
  handlePointerUp = (e: ThreeEvent<PointerEvent>): void => {
    this.userEventsService.recordPointerUp(e.nativeEvent);
  };
}
