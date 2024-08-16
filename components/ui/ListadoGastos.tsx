import { Colors } from '@/constants/Colors';
import { formatearCantidad, formatearFecha, listaCategorias } from '@/helpers';
import { useAppState } from '@/store/appStore';
import { Gasto, Tipo } from '@/types/typesApp';
import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import React, { Fragment, useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import { Button, Card, Chip, DataTable, Divider, List, TextInput, Text as Texto } from 'react-native-paper';
import DialogAlert from './Dialog';
import ModalEdit from './ModalEdit';
import { useColorScheme } from '@/hooks/useColorScheme';

const IconosGasto = [
    {
        nombre: "Ahorro",
        icono: <FontAwesome6 name="money-bill-trend-up" size={24} color="#3B9CCF" />
    },
    {
        nombre: "Comida",
        icono: <FontAwesome6 name="utensils" size={24} color="#EE4135" />
    },
    {
        nombre: "Salud",
        icono: <AntDesign name="heart" size={24} color="#EE4135" />
    },
    {
        nombre: "Transporte",
        icono: <FontAwesome6 name="bus" size={24} color="#9FE88D" />
    },
    {
        nombre: "Casa",
        icono: <FontAwesome6 name="house-chimney-user" size={24} color="#38BDF8" />
    },
    {
        nombre: "Gastos Varios",
        icono: <FontAwesome5 name="money-check-alt" size={24} color="#CA8E1B" />
    },
    {
        nombre: "Ocio",
        icono: <FontAwesome6 name="face-smile-beam" size={24} color="#FBBF24" />
    },
    {
        nombre: "Vestimenta",
        icono: <FontAwesome5 name="tshirt" size={24} color="#FBBF24" />
    },
    {
        nombre: "Cuentas Varias",
        icono: <FontAwesome6 name="wallet" size={24} color="#CA8E1B" />
    }
]
const ListadoGastos = () => {
    const colorSchema = useColorScheme();
    const texto = Colors[colorSchema == 'dark' ? 'dark' : 'light'].text;
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const categorias = listaCategorias();
    const [selectedChip, setSelectedChip] = useState<Tipo | null>();
    const [idGasto, setIdGasto] = useState(0);
    const [visible, setVisible] = useState(false);
    const [modal, setModal] = useState(false);
    const [gasto, setGasto] = useState<Gasto>({
        id: 0,
        concepto: "",
        cantidad: 0,
        fecha: new Date(),
        categoria: categorias[0],
    });

    const hideModal = () => setModal(false);
    const gastos = useAppState(state => state.gastos);
    const getGastosPorCategoria = useAppState(state => state.getGastosPorCategoria);
    const deleteGasto = useAppState(state => state.deleteGasto);
    const gastosCategoria = useAppState(state => state.gastosCategoria);
    const editGasto = useAppState(state => state.editGasto);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const selectChip = (categoria: Tipo) => {
        setSelectedChip((prevSelectedChip) => (prevSelectedChip === categoria ? null : categoria));
    };

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, gastosCategoria.length);
    
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage,gastos]);

    useEffect(() =>{
        getGastosPorCategoria();
    },[])

    useEffect(() =>{
        getGastosPorCategoria(selectedChip as Tipo);
    },[selectedChip,gastos])

    const deleteGastoHandler = (id: number) => {
        deleteGasto(id);
        hideDialog();
        setIdGasto(0);
    };

    const handleChangeGasto = (value: string | number | Date | Tipo, name: string) =>{
        setGasto({
            ...gasto,
            [name] : value
        });
    }

    const handleEdit = () => {
        editGasto(gasto);
        hideModal();
    }

    const getIcon = (categoria: Tipo) => {
        return IconosGasto.find(ic => ic.nombre === categoria)?.icono;
    }

    return (
        <List.Section style={{marginHorizontal: 5}}>
            <List.Subheader style={{fontSize: 20, textAlign: 'center', marginTop: 15, fontWeight: '900', textTransform: 'uppercase', color: texto}}>Gastos</List.Subheader>
            
            <List.Section style={{marginBottom: 10}}>   
                <Text style={{color: texto, fontSize: 15, marginBottom: 15}}>Filtrar por categoria</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', gap: 5}}>
                    {categorias.map((c, i) => (
                        <Chip
                            key={i}
                            onPress={() => selectChip(c)}
                            selected={selectedChip === c}
                            
                        >
                            {c}
                        </Chip>
                    ))}
                </View>
            </List.Section>
            
            
            {gastosCategoria?.length > 0 ? (
                <>
                    {gastosCategoria.slice(from, to).map(gasto => (
                        <Fragment key={gasto.id}>
                            <List.Item
                                key={gasto?.id}
                                title={""}
                                left={() => (
                                    <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', gap: 25}}>
                                        
                                        {getIcon(gasto.categoria)}
                                           
                                        <View style={{alignItems: 'flex-start', gap: 5}}>
                                            <Text style={{ fontSize: 17, color: texto}}>{gasto.concepto}</Text>
                                            <Text style={{ fontSize: 15, color: texto, fontWeight: '700'}}>{gasto.categoria}</Text>
                                            <Text style={{ fontSize: 15, color: texto, fontWeight: '800'}}>{formatearCantidad(gasto.cantidad)}</Text>
                                            <Text style={{ fontSize: 15, color: texto}}>{formatearFecha(gasto.fecha.toString())}</Text>
                                        </View>
                                    </View>
                                )}
                                right={() => (
                                    <View style={{flexDirection: 'column', alignItems: 'center', gap: 5}}>
                                        <Button compact theme={{roundness: 1}} mode="text" onPress={() => {setGasto(gasto); setModal(true)}}>
                                            <FontAwesome6 name="pen-to-square" color="#9FE88D" size={20}/>
                                        </Button>
                                        <Button compact theme={{roundness: 1}} mode="text" onPress={() => {showDialog(); setIdGasto(gasto.id)}}>
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
                            numberOfPages={Math.ceil(gastosCategoria.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`Página ${page + 1} de ${Math.ceil(gastosCategoria.length / itemsPerPage)}`}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </View>
                </>
            ) : (
                <List.Item title="No hay gastos para esa categoria" titleStyle={{textAlign: 'center', fontWeight: '700', marginTop: 10}}/>
            )}

            {visible && (
                <DialogAlert visible={visible} hideDialog={hideDialog} title='¿Está seguro de querer eliminar este gasto?' message='Esta acción no podrá ser recuperada'
                    buttons={(
                        <>
                            <Button onPress={() => {hideDialog(); setIdGasto(0)}}>No</Button>
                            <Button onPress={() => deleteGastoHandler(idGasto)} textColor='#D32F2F'>Sí, eliminar</Button>
                        </>
                    )}
                />
            )}

            {modal && (
                <ModalEdit visible={modal} hideModal={hideModal} containerStyle={{backgroundColor: Colors[colorSchema == 'dark' ? 'dark' : 'light'].fondoClaro, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10}}>
                    <View style={{paddingHorizontal: 10 , marginTop: 20}}>
                        <Texto variant='headlineLarge' style={{fontWeight: '800',textAlign: 'center', textTransform: 'uppercase'}}>Editar Gasto</Texto>
                        <Texto variant='labelLarge' style={{fontWeight: '600',textAlign: 'center', marginBottom: 5, marginTop: 2}}>Aquí podrás editar el gasto</Texto>
                        
                        <Card theme={{roundness: 3}} style={{width: '100%', backgroundColor: `${Colors[colorSchema == 'dark' ? 'dark': 'light'].fondoClaro}`}} mode='contained'>
                            <Card.Content style={{width: '100%'}}>
                                <Texto variant='labelLarge' style={{marginVertical: 15, fontWeight: '700'}}>Datos del Gasto:</Texto>
                                <View style={{width: '100%', flexDirection: 'column', alignItems: 'stretch', gap: 15}}>
                                    <TextInput
                                        label="Concepto del Gasto"
                                        value={gasto?.concepto}
                                        onChangeText={text => handleChangeGasto(text, "concepto")}
                                    />
                                    <TextInput
                                        label="Monto del Gasto"
                                        value={gasto?.cantidad.toString()}
                                        keyboardType='number-pad'
                                        onChangeText={text => handleChangeGasto(Number(text), "cantidad")}
                                    />
                                    <Texto variant='labelMedium' style={{marginTop: 15, fontWeight: '700'}}>Seleccione una categoría</Texto>                            
                                    
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', gap: 5}}>
                                        {categorias.map((c, i) => (
                                            <Chip
                                                key={i}
                                                onPress={() => handleChangeGasto(c ,"categoria")}
                                                selected={gasto.categoria === c}
                                                mode='outlined'
                                            >
                                                {c}
                                            </Chip>
                                        ))}
                                    </View>

                                    <Button theme={{ roundness: 1 }} icon="pencil" mode="contained-tonal" onPress={() => handleEdit()}>
                                        Editar Gasto
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

export default ListadoGastos
