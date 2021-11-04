import { usePlateStore } from '../plate.store';
import { getPlateState } from './getPlateState';

/**
 * Get editor ref which is never updated.
 */
export const useStoreEditorRef = <T = {}>(id?: string | null) =>
  usePlateStore((state) => getPlateState<T>(state as any, id)?.editor);
