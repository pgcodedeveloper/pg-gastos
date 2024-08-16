import { Colors } from '@/constants/Colors'
import { formatearCantidad, formatearFecha } from '@/helpers'
import { useAppState } from '@/store/appStore'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import React, { Fragment, useEffect, useState } from 'react'
import {Text, View } from 'react-native'
import { Button, Card, DataTable, Divider, Icon, IconButton, List, MD3Colors, TextInput, Text as Texto } from 'react-native-paper'
import DialogAlert from './Dialog'
import ModalEdit from './ModalEdit'
import { Ingreso } from '@/types/typesApp'
import { useColorScheme } from '@/hooks/useColorScheme'

const ListadoIngresos = () => {
    const colorSchema = useColorScheme();
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    const [visible, setVisible] = useState(false);
    const [idIngreso, setIdIngreso] = useState(0);
    const [modal, setModal] = useState(false);
    const [ingreso, setIngreso] = useState<Ingreso>({
        id: 0,
        concepto: "",
        cantidad: 0,
        fecha: new Date(),
    })
    const hideModal = () => setModal(false);

    const ingresos = useAppState(state => state.ingresos);
    const deleteIngreso = useAppState(state => state.deleteIngreso);
    const editIngreso = useAppState(state => state.editIngreso);
    const texto = Colors[colorSchema == 'dark' ? 'dark' : 'light'].text;
    
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, ingresos.length);
    
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage,ingresos]);

    const handleDelete = () => {
        deleteIngreso(idIngreso);
        hideDialog();
        setIdIngreso(0);
    };

    const handleChangeIngreso = (value: string | number | Date, name: string) =>{
        setIngreso({
            ...ingreso,
            [name] : value
        });
    }

    const handleEdit = () => {
        editIngreso(ingreso);
        hideModal();
    }

    return (
        <List.Section style={{marginHorizontal: 5}}>
            <List.Subheader style={{fontSize: 20, textAlign: 'center', marginTop: 15, fontWeight: '900', textTransform: 'uppercase', color: Colors[colorSchema == 'dark' ? 'dark' : 'light'].text}}>Ingresos</List.Subheader>
            {ingresos?.length > 0 ? (
                <>
                    {ingresos.slice(from, to).map(ingreso => (
                        <Fragment key={ingreso.id}>
                            <List.Item
                                key={ingreso?.id}
                                title={""}
                                left={() => (
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 25}}>
                                        <FontAwesome6 name="money-bill-trend-up" size={30} color="#3B9CCF" />
                                        <View style={{alignItems: 'flex-start', gap: 5}}>
                                            <Text style={{ fontSize: 20, color: texto}}>{ingreso.concepto}</Text>
                                            <Text style={{ fontSize: 15, color: texto}}>{formatearCantidad(ingreso.cantidad)}</Text>
                                            <Text style={{ fontSize: 15, color: texto}}>{formatearFecha(ingreso.fecha.toString())}</Text>
                                        </View>
                                    </View>
                                )}
                                right={() => (
                                    <View style={{flexDirection: 'column', alignItems: 'center', gap: 5}}>
                                        <Button compact theme={{roundness: 1}} mode="text" onPress={() => {setIngreso(ingreso); setModal(true)}}>
                                            <FontAwesome6 name="pen-to-square" color="#9FE88D" size={20}/>
                                        </Button>
                                        <Button compact theme={{roundness: 1}} mode="text" onPress={() => {showDialog(); setIdIngreso(ingreso.id)}}>
                                            <FontAwesome6 name="trash" color="#D32F2F" size={20}/>
                                        </Button>
                                    </View>
                                )}
                            />
                            <Divider bold theme={{ colors: { outlineVariant: '#4D5D6F'}}}/>
                        </Fragment>
                    ))}
                    <View style={{alignItems: 'center'}}>
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(ingresos.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`Página ${page + 1} de ${Math.ceil(ingresos.length / itemsPerPage)}`}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </View>
                </>
            ) : (
                <List.Item title="No hay ingresos registrados" titleStyle={{textAlign: 'center', fontWeight: '700', marginTop: 10}}/>
            )}

            {visible && (
                <DialogAlert visible={visible} hideDialog={hideDialog} title='¿Está seguro de querer eliminar este ingreso?' message='Esta acción no podrá ser recuperada'
                    buttons={(
                        <>
                            <Button onPress={() => {hideDialog(); setIdIngreso(0)}}>No</Button>
                            <Button onPress={() => handleDelete()} textColor='#D32F2F'>Sí, eliminar</Button>
                        </>
                    )}
                />
            )}

            {modal && (
                <ModalEdit visible={modal} hideModal={hideModal} containerStyle={{backgroundColor: Colors[colorSchema == 'dark' ? 'dark' : 'light'].fondoClaro, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10}}>
                    <View style={{paddingHorizontal: 10 , marginTop: 20}}>
                        <Texto variant='headlineLarge' style={{fontWeight: '800',textAlign: 'center', textTransform: 'uppercase'}}>Editar Ingreso</Texto>
                        <Texto variant='labelLarge' style={{fontWeight: '600',textAlign: 'center', marginBottom: 5, marginTop: 2}}>Aquí podrás editar el ingreso</Texto>
                        
                        <Card theme={{roundness: 3}} style={{width: '100%', backgroundColor: `${Colors[colorSchema == 'dark' ? 'dark': 'light'].fondoClaro}`}} mode='contained'>
                            <Card.Content style={{width: '100%'}}>
                                <Texto variant='labelLarge' style={{marginVertical: 15, fontWeight: '700'}}>Datos del Ingreso:</Texto>
                                <View style={{width: '100%', flexDirection: 'column', alignItems: 'stretch', gap: 15}}>
                                    <TextInput
                                        label="Concepto del ingreso"
                                        value={ingreso?.concepto}
                                        onChangeText={text => handleChangeIngreso(text, "concepto")}
                                    />
                                    <TextInput
                                        label="Monto del Ingreso"
                                        value={ingreso?.cantidad.toString()}
                                        keyboardType='number-pad'
                                        onChangeText={text => handleChangeIngreso(Number(text), "cantidad")}
                                    />
                                    

                                    <Button theme={{ roundness: 1 }} icon="pencil" mode="contained-tonal" onPress={() => handleEdit()}>
                                        Editar Ingreso
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>

                        
                    </View>
                </ModalEdit>
            )}
        </List.Section>
    )
}

export default ListadoIngresos
