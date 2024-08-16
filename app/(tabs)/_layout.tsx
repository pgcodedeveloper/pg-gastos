import { Slot, Stack, Tabs } from 'expo-router';
import React, { useRef } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/navigation/TabBar';
import HomeScreen from '.';
import { Animated } from 'react-native';
import useAnimationStore from '@/store/animationStore';



export default function TabLayout() {
    const scrollY = useAnimationStore((state) => state.scrollY);

    // Crea una interpolación para translateY basada en scrollY
    const translateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 200],
        extrapolate: 'clamp',
    });

    return (
        <>
            <Stack.Screen 
                options={{ 
                    headerShown: true,
                    header: () => {
                        return <Header />
                    }
                }}
            />
            
            <Tabs
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => (
                    <TabBar props={props} translateY={translateY} />
                )}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Inicio',
                            
                        }}
                    />
                    <Tabs.Screen
                        name="ingresos"
                        options={{
                            title: 'Ingresos',
                        }}
                    />
                    <Tabs.Screen
                        name="gastos"
                        options={{
                            title: 'Gastos',
                        }}
                    />
                    <Tabs.Screen
                        name="estadisticas"
                        options={{
                            title: 'Estadística',
                        }}
                    />
                    <Tabs.Screen
                        name="settings"
                        options={{
                            title: 'Settings',
                        }}
                    />
                </Tabs>
        </>
        
    );
}

