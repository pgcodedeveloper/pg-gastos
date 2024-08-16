import ScreenContainer from '@/components/navigation/ScreenContainer';
import ContenedorPresupuesto from '@/components/ui/ContenedorPresupuesto';
import ListadoGastos from '@/components/ui/ListadoGastos';
import ListadoIngresos from '@/components/ui/ListadoIngresos';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useAnimationStore from '@/store/animationStore';
import { useAppState } from '@/store/appStore';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';

export default function HomeScreen() {
    const pathname = usePathname();
    const iniciarApp = useAppState(state => state.iniciarApp);
    const setScroll = useAnimationStore(store => store.setScrollY);
    const [vista, setVista] = useState('ingresos');
    
    useEffect(() =>{
        iniciarApp();

    },[])
    useEffect(() =>{
        if(pathname == "/"){
            setScroll(new Animated.Value(0));
        }
    },[pathname])
    return (
        <ScreenContainer style={{marginBottom: 25}}>
            <ContenedorPresupuesto />
            <Text variant='headlineMedium' style={{marginVertical: 15, textAlign: 'center', color: Colors[useColorScheme() == 'dark' ? 'dark' : 'light'].text, fontWeight: '900'}}>Administre su cuenta</Text>
            <Card theme={{roundness: 3}} style={{ backgroundColor: `${Colors[useColorScheme() == 'dark' ? 'dark': 'light'].contenedor}`}} mode='elevated'>
                <Card.Content>
                    <SegmentedButtons
                        value={vista}
                        theme={{roundness: 1}}
                        onValueChange={setVista}
                        density='small'
                        buttons={[
                            {
                                value: 'ingresos',
                                label: 'Ingresos',
                            },
                            {
                                value: 'gastos',
                                label: 'Gastos',
                            },
                        ]}
                    />
                    
                    {vista == 'ingresos' ? (
                        <ListadoIngresos />
                    ): (
                        <ListadoGastos />
                    )}
                </Card.Content>
            </Card>       
        </ScreenContainer>
    );
}

