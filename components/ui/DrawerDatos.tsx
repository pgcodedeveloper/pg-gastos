import { Gasto, Ingreso } from '@/types/typesApp'
import React from 'react'
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from './drawer'
import { Text } from './text'
import { Heading } from './heading'
import { formatearCantidad, formatearFecha } from '@/helpers'
import { Button, ButtonText } from './button'
import { Badge, BadgeText } from './badge'

interface Props {
    dato: Ingreso | Gasto,
    open: boolean,
    handleClose: () => void,
}

const DrawerDatos = ({ dato, open, handleClose }: Props) => {
    return (
        <>
            <Drawer
                isOpen={open}
                onClose={() => {
                    handleClose()
                }}
                size="md"
                anchor="bottom"
            >
                <DrawerBackdrop/>
                <DrawerContent className='bg-[#334155]'>
                    <DrawerHeader>
                        <Heading size="3xl" className='font-extrabold'>{"categoria" in dato ? "Gasto" : "Ingreso"}</Heading>
                    </DrawerHeader>
                    <DrawerBody>
                        <Text size="xl" className="text-typography-800">
                            {dato.concepto}
                        </Text>
                        <Text size="2xl" className="font-black text-typography-500 mt-3">
                            {formatearCantidad(dato.cantidad)}
                        </Text>  
                        <Text size='lg' className='mt-3'>
                            {formatearFecha(dato.fecha.toString())}
                        </Text>  

                        {"categoria" in dato && (
                            <Text className='mt-3' size='xl'>
                                <Badge variant='solid' size='lg' action='info' className='rounded-full'>
                                    <BadgeText className='font-bold'>{dato.categoria}</BadgeText>
                                </Badge>
                            </Text>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button onPress={handleClose}>
                            <ButtonText>Cerrar</ButtonText>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerDatos
