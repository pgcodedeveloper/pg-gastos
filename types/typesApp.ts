import { Animated } from "react-native";

export interface Ingreso {
    id: number;
    concepto: string;
    cantidad: number;
    fecha: Date;
}

export enum Tipo{
    Ahorro = "Ahorro",
    Comida = "Comida",
    Salud = "Salud",
    Casa = "Casa",
    Gastos_varios = "Gastos Varios",
    Transporte = "Transporte",
    Ocio = "Ocio",
    Vestimenta = "Vestimenta",
    Cuentas_varias = "Cuentas Varias",
}


export interface Gasto {
    id: number;
    concepto: string;
    cantidad: number;
    fecha: Date;
    categoria: Tipo;
}

export type Theme = 'light' | 'dark';