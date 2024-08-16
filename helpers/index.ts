import { Gasto, Ingreso, Tipo } from "@/types/typesApp";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing'
import { useColorScheme } from "react-native";

export const formatearCantidad = (valor: number) =>{
    return Number(valor).toLocaleString('en-US',{
        style: 'currency',
        currency: 'USD',
    })
}

export const formatearFecha = (fecha: string) =>{
    const f = new Date(fecha);
    return f.toLocaleDateString('es-ES',{
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}

export const formatearAno= (fecha: string) =>{
    const fechaN= new Date(fecha);
    return fechaN.toLocaleDateString('es-ES',{
        year: 'numeric'
    });
}

export const formatearMes= (fecha: string) =>{
    const fechaN= new Date(fecha);

    return fechaN.toLocaleDateString('es-ES',{
        month: 'long',
        year: 'numeric'
    });
}

export const listaCategorias = () =>{
    return Object.values(Tipo) as Tipo[];
}

export const calcularTotalesPorCategoria = (gastos: Gasto[]) => {
    const totalesPorCategoria: { [key in Tipo]: number } = {
      [Tipo.Ahorro]: 0,
      [Tipo.Comida]: 0,
      [Tipo.Salud]: 0,
      [Tipo.Casa]: 0,
      [Tipo.Gastos_varios]: 0,
      [Tipo.Transporte]: 0,
      [Tipo.Ocio]: 0,
      [Tipo.Vestimenta]: 0,
      [Tipo.Cuentas_varias]: 0,
    };
  
    gastos.forEach(gasto => {
      totalesPorCategoria[gasto.categoria] += gasto.cantidad;
    });
  
    return totalesPorCategoria;
};

const generarID = () =>{
    const random = Math.random().toString(36).substring(2,11);
    const f = Date.now().toString(36);
    return random + f;
}

export const handlePDF = (gastos: Gasto[],presupuesto: number, ingresos: Ingreso[]) =>{
    const totalGastado= gastos.reduce((total,gasto) => gasto.cantidad + total, 0);
    const totalDisponible = (presupuesto >= totalGastado) ? (presupuesto - totalGastado) : 0;
    const totaldeficit= (totalDisponible === 0) ? (presupuesto - totalGastado) : 0;
    const arrayPresu= [{
        presupuesto: `${formatearCantidad(presupuesto)}`,
        disponible: `${formatearCantidad(totalDisponible)}`,
        gastado: `${formatearCantidad(totalGastado)}`,
        deficit: `${formatearCantidad(totaldeficit)}`
    }]
    const rows1:any =[];
    arrayPresu.map(array => rows1.push(Object.values(array)));

    let html1 = `
        <tr>
    `;
    rows1[0].forEach((r:any) => {
        html1 += `
            <td>${r}</td>
        `
    });
    html1 += ` </tr> `;

    const rows3:any= [];
    let ingreso = [];
    ingresos.map(pres =>{
        const {cantidad,concepto,fecha} = pres;
        ingreso = [
            "INGRESO",
            concepto.toUpperCase(),
            formatearCantidad(cantidad),
            formatearFecha(fecha.toString())
        ]
        return rows3.push(ingreso);
    });
    
    let html2 = ``;
    rows3.map((r:any) => {
        html2 += `
            <tr>
                <td>${r[0]}</td>
                <td>${r[1]}</td>
                <td>${r[2]}</td>
                <td>${r[3]}</td>
            </tr>
        `
    });
    

    const rows:any= [];
    let gasto = [];
    gastos.map(gas =>{
        const {categoria,concepto,cantidad,fecha} = gas;
        gasto = [
            "GASTO",
            concepto,
            formatearCantidad(cantidad),
            categoria.toUpperCase(),
            formatearFecha(fecha.toString())
        ]
        return rows.push(gasto);
    });

    let html3 = ``;
    rows.map((r:any) => {
        html3 += `
            <tr>
                <td>${r[0]}</td>
                <td>${r[1]}</td>
                <td>${r[2]}</td>
                <td>${r[3]}</td>
                <td>${r[4]}</td>
            </tr>
        `;
    });

    let totalA = 0,totalC = 0,totalCo = 0,totalG = 0,totalO = 0,totalS = 0,totalT = 0, totalV = 0, totalCV = 0;
    gastos.map(gasto =>{
        if(gasto.categoria === "Ahorro"){
            totalA = Number(gasto.cantidad) + totalA;
        }
        else if(gasto.categoria === "Comida"){
            totalCo = Number(gasto.cantidad) + totalCo;
        }
        else if(gasto.categoria === "Casa"){
            totalC = Number(gasto.cantidad) + totalC;
        }
        else if(gasto.categoria === "Gastos Varios"){
            totalG = Number(gasto.cantidad) + totalG;
        }
        else if(gasto.categoria === "Ocio"){
            totalO = Number(gasto.cantidad) + totalO;
        }
        else if(gasto.categoria === "Salud"){
            totalS = Number(gasto.cantidad) + totalS;
        }
        else if(gasto.categoria === "Transporte"){
            totalT = Number(gasto.cantidad) + totalT;
        }
        else if(gasto.categoria === "Vestimenta"){
            totalV = Number(gasto.cantidad) + totalV;
        }
        else {
            totalCV = Number(gasto.cantidad) + totalCV;
        }
    });
    let row4 = [
        ["AHORRO",formatearCantidad(totalA)],
        ["COMIDA",formatearCantidad(totalCo)],
        ["CASA",formatearCantidad(totalC)],
        ["GASTOS VARIOS",formatearCantidad(totalG)],
        ["OCIO", formatearCantidad(totalO)],
        ["SALUD",formatearCantidad(totalS)],
        ["TRANSPORTE",formatearCantidad(totalT)],
        ["VESTIMENTA",formatearCantidad(totalV)],
        ["CUENTAS VARIAS",formatearCantidad(totalCV)],
    ];

    let html4 = ``;
    row4.map(r => {
        html4 += 
        `
            <tr>
                <td>${r[0]}</td>
                <td>${r[1]}</td>
            </tr>
        `
    });
    
    const html = `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="text-align: center;">
                <main>
                    <div>
                        <img src="https://res.cloudinary.com/damn8kr5q/image/upload/v1706201218/ax6vdss59y90zhqcxd4i.png" alt="Imagen PG"/>
                        <div class="cont">
                            <p style="color: rgb(133,133,133); font-weight: 800; margin-top: 30px; font-size: 25px;">Fecha de emisíon: ${formatearFecha(new Date().toString())}</p>
                            <p style="color: rgb(133,133,133); font-weight: 600;">ID del reporte: <span>${generarID()}</span></p>
                        </div>
                    </div>

                    <h1 style="font-size: 45px; font-weight: 700; color: rgb(2, 132, 199); margin-top: 50px;">
                        Reporte de gastos del mes de ${formatearMes(new Date().toString())}
                    </h1>

                    <h2>Presupuesto</h2>
                    <table>
                        <caption>Datos del mes</caption>
                        <tr> 
                            <th>Presupuesto Total</th> 
                            <th>Saldo a favor</th> 
                            <th>Total Gastado</th>
                            <th>Déficit Total</th>
                        </tr>
                        ${html1 ?? ""}
                    </table>

                    <h2 style="margin-top: 35px;">Ingresos del Mes</h2>
                    <table>
                        <caption>Datos de los ingresos del mes</caption>
                        <tr> 
                            <th>Tipo</th> 
                            <th>Nombre del Ingreso</th> 
                            <th>Cantidad</th>
                            <th>Fecha</th>
                        </tr>
                        ${html2.toString() ?? ""}
                    </table>

                    <h2 style="margin-top: 35px;">Gastos del Mes</h2>
                    <table>
                        <caption>Datos de los gastos del mes</caption>
                        <tr> 
                            <th>Tipo</th> 
                            <th>Nombre del Gasto</th> 
                            <th>Precio del Gasto</th>
                            <th>Categoría del Gasto</th>
                            <th>Fecha del Gasto</th>
                        </tr>
                        ${html3.toString() ?? ""}
                    </table>

                    <h2 style="margin-top: 35px;">Gastos por Categoría</h2>
                    <table>
                        <caption>Datos de los gastos por categoría</caption>
                        <tr> 
                            <th>Nombre de la Categoría</th> 
                            <th>Total gastado</th>
                        </tr>
                        ${html4.toString() ?? ""}
                    </table>
                </main>
            </body>

            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                }

                h2{
                    text-align: center;
                    text-transform: uppercase;
                }
                
                main{
                    width: 100%;
                    margin: 0 auto;
                } 

                div{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                }
        
                .cont{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
        
                div img{
                    width: 35px;
                    height: 35px;
                }

                table {     
                    font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
                    font-size: 13px;    
                    margin: 45px;
                    text-align: left;    
                    border-collapse: collapse;
                    width: 90%; 
                }

                th {     
                    font-size: 15px;     
                    font-weight: 800;     
                    padding: 8px;     
                    background: #b9c9fe;
                    border-top: 4px solid #aabcfe;    
                    border-bottom: 1px solid #fff; color: #039; 
                }

                td {    
                    padding: 8px;     
                    background: #e8edff;     
                    border-bottom: 1px solid #fff;
                    color: #669;    
                    border-top: 1px solid transparent; 
                }

                tr:hover td { 
                    background: #d0dafd; 
                    color: #339; 
                }
            </style>
        </html>
    `;
    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    printToFile();
}

export const getSystemTheme = () => {
    const systemTheme = useColorScheme() ? 'light' : 'dark';
    return systemTheme;
}