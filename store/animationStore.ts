import {create} from 'zustand';
import { Animated } from 'react-native';

// Define la interfaz de tu estado
interface AnimationState {
  scrollY: Animated.Value;
  setScrollY: (value: Animated.Value) => void;
}

// Crea el store sin persistencia
const useAnimationStore = create<AnimationState>((set) => ({
  scrollY: new Animated.Value(0),
  setScrollY: (value) => set(() => ({ scrollY: value })),
}));

export default useAnimationStore;
