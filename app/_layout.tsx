import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme }  from '@/hooks/useColorScheme';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme as useColorSchemeSys } from 'react-native';
import { useAppState } from '@/store/appStore';
import { Theme } from '@/types/typesApp';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const systemColorScheme = useColorSchemeSys();
    const cambiarTema = useAppState(state => state.cambiarTema);

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);
    
    useEffect(() => {
        cambiarTema(systemColorScheme as Theme);
    },[systemColorScheme])
    
    if (!loaded) {
        return null;
    }
    return (
        <PaperProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider> 
        </PaperProvider>
    );
}
