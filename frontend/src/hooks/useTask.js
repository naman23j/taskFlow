import { useBoard as useBoardContext } from '../context/BoardContext';

export default function useTask() {
  return useBoardContext();
}
