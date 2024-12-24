import ScreenContainer from '@/components/navigation/ScreenContainer'
import DialogAlert from '@/components/ui/Dialog'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import useAnimationStore from '@/store/animationStore'
import { useAppState } from '@/store/appStore'
import { router, usePathname } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Animated, Linking, View } from 'react-native'
import { Button, Card, Divider, Text } from 'react-native-paper'

const Settings = () => {
    const pathname = usePathname();
    const colorScheme  = useColorScheme();
    const reiniciarApp = useAppState(state => state.reiniciarApp);
    const setScroll = useAnimationStore(store => store.setScrollY);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if(pathname == '/settings') {
            setScroll(new Animated.Value(0));
        }
    }, [pathname])

    const hideDialog = () => {
        setVisible(false);
    }

    const resetApp = () => {
        reiniciarApp();
        hideDialog();
        setTimeout(() => {
            router.push('/(tabs)');
        }, 500);
    }
    return (
        <ScreenContainer style={{marginTop: 20}}>
            <Text variant='headlineMedium' style={{marginVertical: 15, textAlign: 'center', color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text, fontWeight: '900'}}>Ajustes del Sistema</Text>
        
            <Card theme={{roundness: 3}} style={{ backgroundColor: `${Colors[colorScheme == 'dark' ? 'dark': 'light'].contenedor}`}}>
                <Card.Content>
                    <Text style={{fontSize: 20, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Información del la aplicación</Text>
                    <Text style={{fontSize: 15, marginTop: 10, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Versión 1.1.0</Text>
                    <Text style={{fontSize: 15, marginTop: 10, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Creado por: 
                        <Text style={{fontWeight: '900', color: '#3B9CCF'}}> PG.CODE</Text>
                    </Text>

                    <Text style={{marginVertical: 10, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Contactar por: </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10}}>
                        <Button mode='contained-tonal' buttonColor='#0A66C2' textColor='white' theme={{roundness: 1}} icon={"linkedin"}
                            onPress={() => {
                                Linking.openURL('https://www.linkedin.com/in/pablo-gillespie-795a46223/')
                            }}
                        >LinkedIn</Button>
                        <Button mode='contained-tonal' buttonColor='#3B9CCF' textColor='white' theme={{roundness: 1}} icon={"web"}
                            onPress={() => {
                                Linking.openURL('https://pgcodedeveloper.pages.dev/')
                            }}
                        >Sitio Web</Button>
                    </View>
                </Card.Content>
            </Card>

            <Divider bold theme={{ colors: { outlineVariant: '#4D5D6F'}}} style={{marginVertical: 20}}/>

            <Card theme={{roundness: 3}} style={{ backgroundColor: `${Colors[colorScheme == 'dark' ? 'dark': 'light'].contenedor}`}}>
                <Card.Content>
                    <Text style={{fontSize: 20, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Configuración de la aplicación</Text>
                    <View>
                        <Text style={{fontSize: 15, marginTop: 10, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Reiniciar datos: </Text>
                        <Text style={{fontSize: 13.5, marginBottom: 10, color: Colors[colorScheme == 'dark' ? 'dark' : 'light'].text}}>Esta opción permite eliminar todos los datos de los <Text style={{ fontWeight: '800'}}>ingresos</Text> y <Text style={{ fontWeight: '800'}}>egresos</Text> del mes terminado y comenzar el nuevo mes.</Text>
                        <Button mode='contained-tonal' icon={"refresh"} theme={{ roundness: 1}}
                            onPress={() => {
                                setVisible(true);
                            }}
                        >Reiniciar</Button>
                       
                    </View>
                </Card.Content>
            </Card>

            {visible && (
                <DialogAlert visible={visible} hideDialog={hideDialog} title='¿Está seguro de querer reiniciar todos los datos?' message='Esta acción no podrá ser recuperada'
                    buttons={(
                        <>
                            <Button onPress={() => {hideDialog()}}>No</Button>
                            <Button onPress={() => resetApp()} textColor='#D32F2F'>Sí, reiniciar</Button>
                        </>
                    )}
                />
            )}
        </ScreenContainer>
    )
}

export default Settings
