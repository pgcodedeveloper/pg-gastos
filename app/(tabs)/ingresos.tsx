import ScreenContainer from '@/components/navigation/ScreenContainer'
import Alerta from '@/components/ui/Alerta'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import useAnimationStore from '@/store/animationStore'
import { useAppState } from '@/store/appStore'
import { router, usePathname } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Animated, View } from 'react-native'
import { Button, Card, Text, TextInput } from 'react-native-paper'

const Ingresos = () => {
    const pathname = usePathname();
    const colorScheme  = useColorScheme();
    const addIngreso = useAppState(state => state.addIngreso);
    const setScroll = useAnimationStore(store => store.setScrollY);

    const [concepto, setConcepto] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(0);
    const [visible, setVisible] = useState(false);
    const [alerta, setAlerta] = useState({label: '', texto: '', error: false});

    useEffect(() => {
        if(pathname == '/ingresos'){
            setScroll(new Animated.Value(0));
        }
    }, [pathname])

    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);

    const handleIngreso = () =>{
        if(!concepto || cantidad == 0){
            setAlerta({label: "", texto: "Debe ingresar concepto y cantidad", error: true});
            onToggleSnackBar();
            return;
        }
        addIngreso(concepto,cantidad);
        setAlerta({label: "OK", texto: "Registro exitoso", error: false});
        onToggleSnackBar();
        setConcepto("");
        setCantidad(0);
        setTimeout(() => {
            router.push('/(tabs)');
        }, 1500);
    }
    return (
        <ScreenContainer style={{justifyContent: 'space-between'}}>
            <Text variant='headlineLarge' style={{fontWeight: '800',textAlign: 'center', textTransform: 'uppercase', marginTop: 15, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Nuevo Ingreso</Text>
            <Text variant='labelLarge' style={{fontWeight: '600',textAlign: 'center', marginBottom: 15, marginTop: 2}}>Aquí podrás agregar un nuevo ingreso al sistema</Text>
            
            <Card theme={{roundness: 3}} style={{width: '100%', backgroundColor: `${Colors[colorScheme == 'dark' ? 'dark': 'light'].contenedor}`}} mode='elevated'>
                <Card.Content style={{width: '100%'}}>
                    <Text variant='labelLarge' style={{marginVertical: 15, fontWeight: '700'}}>Datos del Ingreso:</Text>
                    <View style={{width: '100%', flexDirection: 'column', alignItems: 'stretch', gap: 15}}>
                        <TextInput
                            label="Concepto del ingreso"
                            value={concepto}
                            
                            onChangeText={text => setConcepto(text)}
                        />
                        <TextInput
                            label="Monto del Ingreso"
                            value={cantidad.toString()}
                            keyboardType='number-pad'
                            onChangeText={text => setCantidad(Number(text))}
                        />
                        

                        <Button theme={{ roundness: 1 }} icon="plus" mode="contained-tonal" onPress={() => handleIngreso()}>
                            Agregar ingreso
                        </Button>
                    </View>
                </Card.Content>
            </Card>
            {visible && (
                <Alerta visible={visible} onDismissSnackBar={onDismissSnackBar} label={alerta.label} texto={alerta.texto} error={alerta.error}/>
            )}
        </ScreenContainer>
    )
}

export default Ingresos
