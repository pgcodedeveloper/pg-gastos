import { Colors } from '@/constants/Colors'
import { formatearMes } from '@/helpers'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { Appbar, Avatar, Text } from 'react-native-paper'

const Header = () => {
    return (
        <Appbar.Header elevated style={{ backgroundColor: Colors[useColorScheme() == 'dark' ? 'dark' : 'light'].contenedor}}>
            <Appbar.Content title="Control de Gastos" titleStyle={{ color: Colors[useColorScheme() == 'dark' ? 'dark': 'light'].text, fontWeight: '800'}}/>
            <Text style={{textTransform: 'capitalize', fontWeight: '800', fontSize: 15, marginRight: 5}}>{formatearMes(new Date().toString())}</Text>
        </Appbar.Header>
    )
}

export default Header
