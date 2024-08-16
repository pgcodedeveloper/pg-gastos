import { AntDesign, Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Props {
    props: BottomTabBarProps,
    translateY: Animated.AnimatedInterpolation<string | number>,
}

// Define the possible route names as a union type
type RouteNames = 'index' | 'settings' | 'gastos' | 'ingresos' | 'estadisticas';

const icons: Record<RouteNames, (props: { size: number; color: string }) => JSX.Element> = {
  index: (props) => <Ionicons name="home" size={props.size} color={props.color} />,
  settings: (props) => <Ionicons name="settings" size={props.size} color={props.color} />,
  gastos: (props) => <FontAwesome6 name="coins" size={props.size} color={props.color} />,
  ingresos: (props) => <Entypo name="wallet" size={props.size} color={props.color} />,
  estadisticas: (props) => <Entypo name="bar-graph" size={props.size} color={props.color} />
};

export const TabBar = ({ props: {state, descriptors, navigation},translateY }: Props) => {
    const colorSchema = useColorScheme();
    return (
        <Animated.View style={[styles.tabbar,{backgroundColor: colorSchema == 'light' ? '#a8bcd1' : '#4d5d6f', transform: [{translateY}]}]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                if(["_sitemap", "+not-found"].includes(route.name)) return null;

                const isFocused = state.index === index;

                const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
                };

                const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
                };

                return (
                    <TabBarItem
                        key={route.name}
                        isFocused={isFocused}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        icon={icons[route.name as RouteNames]}
                        label={label.toString()}
                        color={isFocused ? '#02A3EF' : Colors[colorSchema === 'dark' ? 'dark' : 'light'].text}
                    />
                );
            })}
            </Animated.View>
    )
}

export default TabBar

const TabBarItem: React.FC<{
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    icon: (props: { size: number; color: string }) => JSX.Element;
    label: string;
    color: string;
}> = ({ isFocused, onPress, onLongPress, icon: Icon, label, color }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 1.2, // Escala cuando se presiona
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1, // Vuelve a la escala original
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            testID={label}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabbarItems}
        >
            <Animated.View style={{ transform: [{ scale }] }}>
                {Icon({ size: 20, color })}
            </Animated.View>
            <Text style={{ color, fontSize: 13 }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

//Estilos
const styles = StyleSheet.create({
    tabbar:{
        position: 'absolute',
        bottom: 5,
        marginHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent:'space-around',
        borderRadius: 25,
        borderCurve: 'continuous'
    },
    tabbarItems:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
    }
})