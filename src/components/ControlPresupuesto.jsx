import React, {useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Swal from 'sweetalert2';


const ControlPresupuesto = ({ 
    gastos,
    setGastos, 
    presupuesto,
    setPresupuesto,
    setIsValidPresupuesto
}) => {

    const[porcentaje, setPorcentaje] = useState(0);    
    const[disponible, setDisponible] = useState(0);
    const[gastado, setGastado] = useState(0);


    useEffect(()=>{
        const totalGastado = gastos.reduce( (total, gasto) => gasto.cantidad + total, 0);
        
        const totalDisponible = presupuesto - totalGastado;

        // Calcular el porcentaje gastado
        const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2);
       
        setDisponible(totalDisponible);
        setGastado(totalGastado);
        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje);
        }, 1500);
    }, [gastos])

    const formatearCantidad = (cantidad) =>{
        return cantidad.toLocaleString('en-US',{
            style:'currency',
            currency:'USD'
        });
    }

    const handleResetApp = () =>{
        
        Swal.fire({
            title: '¿Deseas resetear la app?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, ¡resetear!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Si el usuario confirma la eliminación
              Swal.fire(
                '¡Eliminado!',
                'La aplicación ha sido reseteada.',
                'success'
              );
              // Llamar a la función para eliminar el registro
               setGastos([])
               setPresupuesto(0)
                setIsValidPresupuesto(false)
            } else {
              // Si el usuario cancela, no hacemos nada
              // o puedes mostrar un mensaje de cancelación si lo deseas
              Swal.fire(
                'Cancelado',
                'La aplicación no ha sido reseteada.',
                'info'
              );
            }
          });
    }

    return (
        <div className='contenedor-presupuesto contenedor sombra dos-columnas'>
            <div>
               <CircularProgressbar
                    styles={buildStyles({
                        pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                        trailColor:'#f5f5f5',
                        textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                    })}
                    value={porcentaje}
                    text={`${porcentaje}% gastado`}
               />
             
            </div>

            <div className='contenido-presupuesto'>
                <button 
                    className='reset-app'
                    type='button'
                    onClick={handleResetApp}
                >
                    Resetear App
                </button>
                <p>
                    <span>Presupuesto:</span>{formatearCantidad(presupuesto)}
                </p>

                <p className={`${disponible < 0 ? 'negativo' : ''}`}>
                    <span>Disponible:</span>{formatearCantidad(disponible)}
                </p>

                <p>
                    <span>Gastado:</span>{formatearCantidad(gastado)}
                </p>
            </div>
        </div>
    )
}

export default ControlPresupuesto
