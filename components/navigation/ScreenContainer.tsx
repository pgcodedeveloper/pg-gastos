import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import useAnimationStore from '@/store/animationStore'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef } from 'react'
import { Animated, ScrollView, StyleSheet, View } from 'react-native'

interface Props {
    children: React.ReactNode,
    style?: React.CSSProperties
}

const ScreenContainer = ({ children, style }: Props) => {
    const setScrollY = useAnimationStore(state => state.setScrollY);
    const localScrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: localScrollY } } }],
        {
            useNativeDriver: true,
            listener: () => {
                setScrollY(localScrollY);
            },
        }
    );
    const colorSchema = useColorScheme();
    return (
        <View style={[styles.container, {backgroundColor: colorSchema == 'dark' ? Colors.dark.fondo : Colors.light.fondo} ]}>
            <StatusBar translucent={true}/>
            <Animated.ScrollView 
                onScroll={handleScroll}>
                <View style={{paddingHorizontal: 10 , marginTop: 20}}>
                    {children}
                </View>
            </Animated.ScrollView>
        </View>
    )
}

export default ScreenContainer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        zIndex: -1
    },
})