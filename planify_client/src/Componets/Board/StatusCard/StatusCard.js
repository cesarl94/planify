import React, { useContext, useState } from 'react';
import './StatusCard.css';
import addtask from '../../../Images/icons/add-task.png';
import edit from '../../../Images/icons/edit.png';
import deleteicon from '../../../Images/icons/delete.png';
import { CardStatusContext } from '../../../Context/CardStatusContext';
import TaskCard2 from '../TaskCard/TaskCard2';
import TaskCard from '../TaskCard/TaskCard';

const StatusCard = () => {
    const { titles } = useContext(CardStatusContext);
    const [Name, Setname] = useState('');
    const [Order, SetOrder] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedStatusEdit, setSelectedStatusEdit] = useState(null);

    const handlecreatetask = async (idestado) => {

        const data = { nombre: Name, orden: Order, id_estado: idestado }

        try {
            await fetch('http://localhost:4000/api/newtask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            window.location.reload();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }
    const handleDeleteStatus = async (idestado) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este estado?')) {
            return;
        }

        try {
            await fetch(`http://localhost:4000/api/state/${idestado}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            window.location.reload();
        } catch (error) {
            console.error('Error deleting status:', error);
        }
    };
    const handleEditstatus = async (idestado) => {
        const data = { nombre: Name, orden: Order, id_estado: idestado }
        try {
            await fetch(`http://localhost:4000/api/updatestate`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            window.location.reload();
        } catch (error) {
            console.error('Error editing status:', error);
        }
    }


    return (
        <div className="StatusCard-scroll">
            {titles.map((status) => (
                <div key={status.id_estado} className="StatusCard-container">
                    <div className="TitleStatus-container">
                        <h3>{status.nombre}</h3>
                        <div>
                            <button className="StatusCard-Button" onClick={() => setSelectedStatus(selectedStatus === status.id_estado ? null : status.id_estado)}>
                                <img src={addtask} className="iconstatus" alt="Add task" />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={edit} className="iconstatus" alt="Edit" onClick={() => setSelectedStatusEdit(selectedStatusEdit === status.id_estado ? null : status.id_estado)} />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={deleteicon} className="iconstatus" alt="Delete" onClick={() => (handleDeleteStatus(status.id_estado))} />
                            </button>
                        </div>
                    </div>


                    {selectedStatus === status.id_estado && (
                        <div className="mb-3">
                            <div className="mb-2">
                                <input type="text" className="form-control" placeholder="Enter name"
                                    onChange={(event) => Setname(event.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="number" className="form-control" placeholder="Enter order" aria-label="Enter order"
                                    onChange={(event) => SetOrder(event.target.value)}
                                />
                            </div>

                            <button
                                type="submit" className="btn-CreateTask w-100"
                                onClick={() => handlecreatetask(status.id_estado)}
                            >
                                Create Task
                            </button>
                        </div>
                    )}
                    {selectedStatusEdit === status.id_estado && (
                        <div className="mb-3">
                            <div className="mb-2">
                                <input type="text" className="form-control" placeholder="Enter name"
                                    onChange={(event) => Setname(event.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    type="number" className="form-control" placeholder="Enter order" aria-label="Enter order"
                                    onChange={(event) => SetOrder(event.target.value)}
                                />
                            </div>

                            <button
                                type="submit" className="btn-CreateTask w-100"
                                onClick={() => handleEditstatus(status.id_estado)}
                            >
                                Edit State
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
