import { Gasto, Ingreso, Theme, Tipo } from "@/types/typesApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";




interface State {
    theme: Theme
    ingresos: Ingreso[]
    presupuestoTotal: number
    gastosTotal: number
    disponible: number
    porcentajeGastado: number
    gastos: Gasto[]
    gastosCategoria: Gasto[]
    iniciarApp: () => void
    addIngreso: (concepto: string, cantidad: number) => void
    addGasto: (concepto: string, cantidad: number, categoria: Tipo) => void,
    getGastosPorCategoria: (categoria?: Tipo) => void,
    deleteIngreso:( id: number ) => void,
    deleteGasto:( id: number ) => void,
    editGasto:( gasto: Gasto ) => void,
    editIngreso:( ingreso: Ingreso ) => void,
    updateData: () => void,
    cambiarTema: (tema: Theme) => void,
    reiniciarApp : () => void
}

export const useAppState = create<State>()(persist((set,get) =>{
    const systemTheme = Appearance.getColorScheme() as Theme;
    return{
        theme: systemTheme,
        ingresos: [],
        presupuestoTotal: 0,
        gastosTotal: 0,
        disponible: 0,
        porcentajeGastado: 0,
        gastos: [],
        gastosCategoria: [],
        iniciarApp: () =>{
            const { ingresos, gastos } = get();
            const presupuestoTotal = ingresos.reduce((acc, ingreso) => acc + ingreso.cantidad, 0);
            const gastosTotal = gastos.reduce((acc, gasto) => acc + gasto.cantidad, 0);
            const disponible = presupuestoTotal - gastosTotal;
            
            set({
                presupuestoTotal,
                gastosTotal,
                disponible,
                porcentajeGastado: gastosTotal != 0 && presupuestoTotal != 0 ? Math.ceil((gastosTotal / presupuestoTotal) * 100) : 0,
            });
        },
        addIngreso: (concepto: string, cantidad: number) => {
            const newIngreso: Ingreso = {
                id: Math.random(),
                concepto,
                cantidad,
                fecha: new Date(),
            };
            set(state => ({
                ingresos: [...state.ingresos, newIngreso],
                presupuestoTotal: state.presupuestoTotal + cantidad,
            }));

            const { updateData } = get();
            updateData();
        },
        addGasto: (concepto: string, cantidad: number, categoria: Tipo) => {
            const newGasto: Gasto = {
                id: Math.random(),
                concepto,
                cantidad,
                fecha: new Date(),
                categoria,
            }
            set(state => ({
                gastos: [...state.gastos, newGasto],
                gastosTotal: state.gastosTotal + cantidad,
            }));

            const { updateData } = get();
            updateData();
        },
        getGastosPorCategoria: (categoria?: Tipo) => {
            if(!categoria) {
                set({gastosCategoria: get().gastos});
            }
            else{
                const gastosPorCategoria = get().gastos.filter(gasto => gasto.categoria === categoria);
                set({gastosCategoria: gastosPorCategoria});
            }
            
        },
        deleteIngreso: (id: number) =>{
            set(state => ({
                ingresos: state.ingresos.filter(ingreso => ingreso.id!== id),
                presupuestoTotal: state.presupuestoTotal - (state.ingresos.find(ingreso => ingreso.id === id) as Ingreso)?.cantidad,
            }));

            const { updateData } = get();
            updateData();
        },
        deleteGasto: (id: number) =>{
            set(state => ({
                gastos: state.gastos.filter(gasto => gasto.id!== id),
            }));

            const { updateData } = get();
            updateData();
        },
        editGasto: (gasto: Gasto) => {
            set(state => ({
                gastos: state.gastos.map(g => g.id === gasto.id? gasto : g),
            }));
            const { updateData } = get();
            updateData();
        },
        editIngreso: (ingreso: Ingreso) => {
            set(state => ({
                ingresos: state.ingresos.map(ing => ing.id === ingreso.id? ingreso : ing),
            }));
            const { updateData } = get();
            updateData();
        },
        updateData: () => {
            const { gastos,ingresos, disponible } = get();
            const gastosTotal = gastos.reduce((acc, gasto) => acc + gasto.cantidad, 0);
            const presupuestoTotal = ingresos.reduce((acc, ingreso) => acc + ingreso.cantidad, 0);
            console.log(ingresos);

            set(state => ({
                gastosTotal,
                presupuestoTotal: presupuestoTotal,
                disponible: presupuestoTotal - gastosTotal,
            }));

            const nuevoPor = Math.ceil((gastosTotal / presupuestoTotal) * 100);
            if(nuevoPor > 100){
                set({porcentajeGastado: 100});
            }
            else{
                set({porcentajeGastado: nuevoPor});
            }
        },
        cambiarTema: (tema: Theme) => {
            set({
                theme: tema,
            });
        },
        reiniciarApp: () => {
            set({
                ingresos: [],
                presupuestoTotal: 0,
                gastosTotal: 0,
                disponible: 0,
                porcentajeGastado: 0,
                gastos: [],
                gastosCategoria: [],
            });
        }
    }
},{
    name: 'app-gastos',
    storage: createJSONStorage(() => AsyncStorage)
}))