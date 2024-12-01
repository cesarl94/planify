import React, { useState } from 'react'
import addstate from '../../../Images/icons/add-state.png'
import './CreateBoard.css'
const CreateBoard = () => {
    const [Creation, SetCreation] = useState(false);
    const [Name, SetName] = useState('')
    const [Order, SetOrder] = useState()



    const handleSubmit = async () => {
        if (!Name || !Order) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const data = { nombre: Name, orden: Order };

        try {
            const response = await fetch('http://localhost:4000/api/newstate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Datos enviados correctamente');
                SetName('');
                SetOrder('');
                SetCreation(false);
                window.location.reload();
            } else {
                console.error('Error al enviar los datos');
            }
        } catch (error) {
            console.error('Hubo un error en la solicitud:', error);
        }
    };


    return (
        <div>
            <button className='CreateBoard-Container' onClick={() => (SetCreation(!Creation))}>
                <img src={addstate} className='addstateicon'></img>
                <p className='CreateBoard-Title'>Planify board</p>
            </button>

            {Creation &&
                <div className="d-flex flex-column gap-3 fade-in">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" className="form-control" id="nombre" placeholder="Escribe tu nombre" onChange={(event)=>(SetName(event.target.value))}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="orden">Orden</label>
                        <input type="number" className="form-control" id="orden" placeholder="Ingresa el orden"  onChange={(event)=>(SetOrder(event.target.value))} />
                    </div>
                    <div className='text-center'>
                    <button onClick={handleSubmit} className="createBoardButtom rounded-3 p-1 col-2 text-white">
                        Crear Estado
                    </button>
                    </div>
                </div>
            }

        </div>
    )
}

export default CreateBoard
