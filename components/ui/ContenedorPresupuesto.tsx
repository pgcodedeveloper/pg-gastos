import { Colors } from '@/constants/Colors';
import { formatearCantidad } from '@/helpers';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppState } from '@/store/appStore';
import React from 'react'
import { View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator'
import { Card, Text } from 'react-native-paper'

const ContenedorPresupuesto = () => {
    const colorScheme = useColorScheme();
    const presupuestoTotal = useAppState(state => state.presupuestoTotal);
    const disponible = useAppState(state => state.disponible);
    const gastosTotal = useAppState(state => state.gastosTotal);
    const porcentajeGastado = useAppState(state => state.porcentajeGastado);
    return (
        <Card theme={{roundness: 3}} style={{ backgroundColor: `${Colors[colorScheme == 'dark' ? 'dark': 'light'].contenedor}`}} mode='elevated'>
            <Card.Title title="Datos actuales" titleStyle={{textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', color: Colors[colorScheme == 'dark' ? 'dark': 'light'].text}} />
            <Card.Content style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <CircularProgress 
                    value={porcentajeGastado}
                    maxValue={100}
                    duration={1000}
                    radius={75}
                    valueSuffix='%'
                    title='Gastado'
                    inActiveStrokeColor='#858585'
                    inActiveStrokeWidth={15}
                    activeStrokeColor={`${porcentajeGastado <= 60 ? '#31b337': porcentajeGastado <= 90 ? '#FBBD23': '#F94A3E'}`}
                    activeStrokeWidth={15}
                    titleStyle={{ fontWeight: 'bold', fontSize: 15}}
                    titleColor={`${porcentajeGastado <= 60 ? '#31b337': porcentajeGastado <= 90 ? '#FBBD23': '#F94A3E'}`}
                />
                <View style={{ gap: 15}}>
                    <Text variant='titleMedium' style={{color: Colors[colorScheme == 'dark' ? 'dark': 'light'].text}}>Presupuesto : {formatearCantidad(presupuestoTotal)}</Text>
                    <Text variant='titleMedium' style={{color: Colors[colorScheme == 'dark' ? 'dark': 'light'].text}}>Gastado: {formatearCantidad(gastosTotal)}</Text>
                    <Text variant='titleMedium' style={{color: porcentajeGastado >= 100 && '#F94A3E' || Colors[colorScheme == 'dark' ? 'dark': 'light'].text}}>Disponible: {formatearCantidad(disponible)}</Text>
                </View>
            </Card.Content>
        </Card>
    )
}

export default ContenedorPresupuesto
