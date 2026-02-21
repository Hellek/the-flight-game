import type { AnyConstructor } from '../types';

export type ResolveTransformerHandler<T extends AnyConstructor<unknown>> = (
  args: ConstructorParameters<T>,
) => void;

class ResolveTransformer {
  private readonly transforms = new Map<
    AnyConstructor<unknown>,
    Set<ResolveTransformerHandler<AnyConstructor<unknown>>>
  >();

  run<T extends AnyConstructor<unknown>>(target: T, args: ConstructorParameters<T>): void {
    const set = this.transforms.get(target as AnyConstructor<unknown>);
    if (set) set.forEach(cb => cb(args as ConstructorParameters<AnyConstructor<unknown>>));
  }

  apply<T extends AnyConstructor<unknown>>(
    target: T,
    transform: ResolveTransformerHandler<T>,
  ): () => void {
    const set = this.transforms.get(target as AnyConstructor<unknown>) ?? new Set();
    set.add(transform as ResolveTransformerHandler<AnyConstructor<unknown>>);
    this.transforms.set(target as AnyConstructor<unknown>, set);
    return () => set.delete(transform as ResolveTransformerHandler<AnyConstructor<unknown>>);
  }
}

export const resolveTransformer = new ResolveTransformer();
