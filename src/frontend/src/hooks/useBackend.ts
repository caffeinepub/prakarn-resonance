import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/**
 * Thin wrapper around useActor — surfaces the actor instance
 * and loading state for use in query hooks.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return {
    actor,
    isActorReady: !!actor && !isFetching,
    isFetching,
  };
}
