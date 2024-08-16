import ScreenContainer from '@/components/navigation/ScreenContainer'
import { Colors } from '@/constants/Colors';
import { calcularTotalesPorCategoria, handlePDF } from '@/helpers';
import { useAppState } from '@/store/appStore';
import { Tipo } from '@/types/typesApp';
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper'
import { BarChart } from 'react-native-chart-kit';
import DialogAlert from '@/components/ui/Dialog';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePathname } from 'expo-router';
import useAnimationStore from '@/store/animationStore';

const estadisticas = () => {
    const pathname = usePathname();
    const colorScheme = useColorScheme();
    const gastos = useAppState(state => state.gastos);
    const presupuestoTotal = useAppState(state => state.presupuestoTotal);
    const ingresos = useAppState(state => state.ingresos);
    const setScroll = useAnimationStore(store => store.setScrollY);

    const totalesPorCategoria = calcularTotalesPorCategoria(gastos);
    const [visible ,setVisible] = useState(false);

    // Convertir los datos para el gráfico
    const categorias = Object.keys(totalesPorCategoria) as Tipo[];
    const cantidades = categorias.map(categoria => totalesPorCategoria[categoria]);

    useEffect(() => {
        if(pathname == '/estadisticas'){
            setScroll(new Animated.Value(0));
        }
    }, [pathname])
    
    const hideDialog = () =>{
        setVisible(false);
    }

    const generarPDF = () =>{
        if(gastos.length > 0){
            handlePDF(gastos, presupuestoTotal,ingresos);
        }
        else{
            setVisible(true);
        }
    }
    return (
        <ScreenContainer style={{marginBottom: 25}}>
            <Text variant='headlineMedium' style={{marginVertical: 15, textAlign: 'center', color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text, fontWeight: '900'}}>Estadísticas Generales</Text>
            <ScrollView horizontal>
                <BarChart
                    data={{
                        labels: categorias,
                        datasets: [
                            {
                                data: cantidades,
                            },
                        ],
                    }}
                    width={740}
                    height={520}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: '#334155',
                        backgroundGradientFrom: '#334155',
                        backgroundGradientTo: '#4e6380',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}
                    verticalLabelRotation={90}

                    style={{
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        borderCurve: 'circular',
                        width: '100%'
                    }}
                />
            </ScrollView>
            <Divider style={{marginTop: 35, marginBottom: 10}} bold theme={{ colors: { outlineVariant: '#4D5D6F'}}}/>
            <Text variant='headlineMedium' style={{marginVertical: 15, textAlign: 'center', color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text, fontWeight: '900'}}>Obtener reporte mensual</Text>
            <Text variant='labelLarge' style={{marginTop: 10, marginBottom: 35, textAlign: 'center'}}>Aquí podrás generar el reporte de tus gastos mensuales en formato PDF</Text>
            <Button icon={"download"} mode='contained-tonal' theme={{roundness: 2}} style={{marginBottom: 35}} onPress={generarPDF}>
                Generar reporte
            </Button>

            {visible && (
                <DialogAlert visible={visible} hideDialog={hideDialog} title='Debes tener al menos un gasto ingresado al sistema' message='Ingrese gastos y luego podrá obtener el reporte mensual'
                    buttons={(
                        <>
                            <Button onPress={() => {hideDialog()}}>Ok</Button>
                        </>
                    )}
                />
            )}
        </ScreenContainer>
    )
}

export default estadisticas

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    chart: {
        height: Dimensions.get('window').height / 2,
    },
    titulo: {
        color: Colors.dark.text,
    },
})