import React, { useContext, useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Importar íconos de react-icons
import { TaskContext } from '../../../Context/TaskContext';
import './TaskCard.css';
import TaskModal from '../TaskModal/TaskModal';

const TaskCard2 = ({ estadoId }) => {
    const { tasks, updateTaskPriority } = useContext(TaskContext);

    const groupedTasks = tasks
        .filter((task) => task.id_estado === estadoId) 
        .reduce((acc, task) => {
            if (!acc[task.id_tarea]) {
                acc[task.id_tarea] = {
                    ...task,
                    Nombre_apellido: [task.Nombre_apellido],
                };
            } else {
                acc[task.id_tarea].Nombre_apellido.push(task.Nombre_apellido); 
            }
            return acc;
        }, {});

    const filteredTasks = Object.values(groupedTasks);

    /////////

    
  

    // Modal tareas
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div>
            {filteredTasks.map((task) => (
                <div className="task-card p-1" key={task.id_tarea} onClick={() => handleTaskClick(task)}>
                    <p>{task.nombre}</p>

                    <div className="d-flex justify-content-between">
                        <div className="stars d-flex">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <FaStar
                                    key={index}
                                    color={index <= (task.prioridad || 0) ? 'gold' : 'lightgray'}                                    size={20}
                                    style={{ cursor: 'pointer', marginRight: '5px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateTaskPriority(task.id_tarea, index); // Actualiza la prioridad
                                    }} 
                                />
                            ))}
                        </div>
                        <div>
                            {[...new Set(task.Nombre_apellido)].map((nombre, idx) => (
                                <p key={idx} style={{ margin: 0 }}>{nombre}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            {selectedTask && (
                <TaskModal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    task={selectedTask} 
                />
            )}
        </div>
    );
};

export default TaskCard2;
