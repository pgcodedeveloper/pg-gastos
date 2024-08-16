import React from 'react'
import { Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'

interface Props {
    visible: boolean,
    onDismissSnackBar: () => void,
    label: string,
    texto: string,
    error?: boolean
}
const Alerta = ({ visible, onDismissSnackBar, label, texto, error}: Props) => {
    return (
        <View style={{position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'stretch'}}>
            <Snackbar
                visible={true}
                onDismiss={onDismissSnackBar}
                style={{backgroundColor: error ? '#CD4945': '#2B593F'}}
                duration={2500}
                action={{
                    label: label,
                    onPress: () => {
                        // Do something
                    },
                }}>
                <Text style={{color: '#ffffff'}}>{texto}</Text>
            </Snackbar>
        </View>
    )
}

export default Alerta
