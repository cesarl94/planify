import React, { useContext, useState } from 'react';
import './StatusCard.css';
import addtask from '../../../Images/icons/add-task.png';
import edit from '../../../Images/icons/edit.png';
import deleteicon from '../../../Images/icons/delete.png';
import { CardStatusContext } from '../../../Context/CardStatusContext';
import { TaskContext } from '../../../Context/TaskContext';
import TaskCard2 from '../TaskCard/TaskCard2';

const StatusCard = () => {
    const { titles } = useContext(CardStatusContext);
    const { addTask } = useContext(TaskContext);
    const [Name, Setname] = useState('');
    const [Order, SetOrder] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handlecreatetask = async (idestado) => {
        const data = { 
            nombre: Name, 
            orden: Order, 
            id_estado: idestado,
            fecha_creacion: new Date().toISOString().split('T')[0],
            fecha_limite: null
        }

        try {
            await addTask(data);
            // Reset input fields and close the input section
            Setname('');
            SetOrder(0);
            setSelectedStatus(null);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    return (
        <div className="StatusCard-scroll">
            {titles.map((status) => (
                <div key={status.id_estado} className="StatusCard-container">
                    <div className="TitleStatus-container">
                        <h3>{status.nombre}</h3>
                        <div>
                            <button 
                                className="StatusCard-Button" 
                                onClick={() => setSelectedStatus(selectedStatus === status.id_estado ? null : status.id_estado)}
                            >
                                <img src={addtask} className="iconstatus" alt="Add task" />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={edit} className="iconstatus" alt="Edit" />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={deleteicon} className="iconstatus" alt="Delete" />
                            </button>
                        </div>
                    </div>

                    {selectedStatus === status.id_estado && (
                        <div className="mb-3">
                            <div className="mb-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter name" 
                                    value={Name}
                                    onChange={(event) => Setname(event.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="number"  
                                    className="form-control" 
                                    placeholder="Enter order" 
                                    value={Order}
                                    onChange={(event) => SetOrder(event.target.value)}
                                />
                            </div>

                            <button
                                type="submit" 
                                className="btn-CreateTask w-100"
                                onClick={() => handlecreatetask(status.id_estado)}
                            >
                                Create Task
                            </button>
                        </div>
                    )}
                    <TaskCard2 estadoId={status.id_estado} />
                </div>
            ))}
        </div>
    );
};

export default StatusCard;