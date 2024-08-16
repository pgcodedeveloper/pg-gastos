import ScreenContainer from '@/components/navigation/ScreenContainer'
import Alerta from '@/components/ui/Alerta'
import { Colors } from '@/constants/Colors'
import { listaCategorias } from '@/helpers'
import { useColorScheme } from '@/hooks/useColorScheme'
import useAnimationStore from '@/store/animationStore'
import { useAppState } from '@/store/appStore'
import { Tipo } from '@/types/typesApp'
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { Animated, View } from 'react-native'
import { Button, Card, Chip, Text, TextInput } from 'react-native-paper'

const Gastos = () => {
    const pathname = usePathname();
    const addGasto = useAppState(state => state.addGasto);
    const setScroll = useAnimationStore(store => store.setScrollY);

    const [concepto, setConcepto] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(0);
    const [categoria, setCategoria] = useState<Tipo>();
    const [visible, setVisible] = useState(false);
    const [alerta, setAlerta] = useState({label: '', texto: '', error: false});
    const categorias = listaCategorias();

    useEffect(() => {
        if(pathname == '/gastos'){
            setScroll(new Animated.Value(0));
        }
    }, [pathname])

    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);

    const handleGasto = () =>{
        if(!concepto || cantidad == 0 || !categoria){
            setAlerta({label: "", texto: "Debe ingresar concepto y cantidad", error: true});
            onToggleSnackBar();
            return;
        }
        addGasto(concepto,cantidad,categoria);
        setAlerta({label: "OK", texto: "Registro exitoso", error: false});
        onToggleSnackBar();
        setConcepto("");
        setCantidad(0);
        setCategoria(undefined);
        setTimeout(() => {
            router.push('/(tabs)')
        }, 1500);
    }
    return (
        <ScreenContainer style={{justifyContent: 'space-between'}}>
            <Text variant='headlineLarge' style={{fontWeight: '800',textAlign: 'center', textTransform: 'uppercase', marginTop: 15}}>Nuevo Gasto</Text>
            <Text variant='labelLarge' style={{fontWeight: '600',textAlign: 'center', marginBottom: 15, marginTop: 2}}>Aquí podrás agregar un nuevo gasto al sistema</Text>

            <Card theme={{roundness: 3}} style={{width: '100%', backgroundColor: `${Colors[useColorScheme() == 'dark' ? 'dark': 'light'].contenedor}`}} mode='elevated'>
                <Card.Content style={{width: '100%'}}>
                    <Text variant='labelLarge' style={{marginVertical: 15, fontWeight: '700'}}>Datos del gasto:</Text>
                    <View style={{width: '100%', flexDirection: 'column', alignItems: 'stretch', gap: 15}}>
                        <TextInput
                            label="Concepto del Gasto"
                            value={concepto}
                            
                            onChangeText={text => setConcepto(text)}
                        />
                        <TextInput
                            label="Monto del Gasto"
                            value={cantidad.toString()}
                            keyboardType='number-pad'
                            onChangeText={text => setCantidad(Number(text))}
                        />
                        <Text variant='labelMedium' style={{marginTop: 15, fontWeight: '700'}}>Seleccione una categoría</Text>                            
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', gap: 5}}>
                            {categorias.map((c, i) => (
                                <Chip
                                    key={i}
                                    onPress={() => setCategoria(c)}
                                    selected={categoria === c}
                                    mode='outlined'
                                >
                                    {c}
                                </Chip>
                            ))}
                        </View>
                        <Button theme={{ roundness: 1 }} icon="plus" mode="contained-tonal" onPress={() => handleGasto()}>
                            Agregar gasto
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

export default Gastos
