import { useAppState } from "@/store/appStore";

export const useColorScheme = () =>{
    const theme = useAppState(state => state.theme);
    return theme;
}
