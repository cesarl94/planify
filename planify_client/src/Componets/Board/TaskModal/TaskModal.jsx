import React, { useContext, useState, useEffect } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import "./TaskModal.css";
import { TaskContext } from "../../../Context/TaskContext";

const TaskModal = ({ isOpen, onClose, task }) => {
  const {
    estados,
    updateTaskState,
    deleteTask,
    updateTaskDates,
    fetchTaskDetails,
    updateTaskPriority,
    fetchTaskUsers,
  } = useContext(TaskContext);

  const [taskDetails, setTaskDetails] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [taskPriority, setTaskPriority] = useState(0);
  const [taskUsers, setTaskUsers] = useState([]);

  useEffect(() => {
    const loadTaskDetails = async () => {
      if (isOpen && task.id_tarea) {
        try {
          const details = await fetchTaskDetails(task.id_tarea);

          setTaskDetails(details);

          setStartDate(
            details.fecha_creacion ? details.fecha_creacion.split("T")[0] : ""
          );

          setEndDate(
            details.fecha_limite ? details.fecha_limite.split("T")[0] : ""
          );

          setSelectedEstado(details.id_estado);

          setTaskPriority(details.prioridad || 0);

          // Cargar usuarios asignados a la tarea

          const users = await fetchTaskUsers(task.id_tarea);

          setTaskUsers(users);
        } catch (error) {
          console.error("Error loading task details:", error);
        }
      }
    };

    loadTaskDetails();
  }, [isOpen, task.id_tarea, fetchTaskDetails, fetchTaskUsers]);

  if (!isOpen || !taskDetails) return null;

  const handleDelete = async () => {
    await deleteTask(taskDetails.id_tarea);
    onClose();
  };

  const handleSaveDates = async () => {
    try {
      await updateTaskDates(taskDetails.id_tarea, startDate, endDate);
    } catch (error) {
      console.error("Error saving dates:", error);
    }
  };

  const handlePriorityChange = async (priority) => {
    try {
      await updateTaskPriority(taskDetails.id_tarea, priority);
      setTaskPriority(priority); // Actualizar el estado local
    } catch (error) {
      console.error("Error cambiando la prioridad:", error);
      alert(`Error al actualizar la prioridad: ${error.message}`);
    }
  };

  const handleChangeEstado = async (e) => {
    const newStateId = parseInt(e.target.value);
    await updateTaskState(taskDetails.id_tarea, newStateId);
    setSelectedEstado(newStateId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-layout">
          <div className="modal-left-section">
            <div className="modal-header">
              <FaUser className="header-icon" />
              <input
                type="text"
                value={taskDetails.nombre}
                readOnly
                className="modal-title"
              />
            </div>
            <textarea
              value={taskDetails.descripcion || ""}
              readOnly
              className="modal-description"
            />
          </div>
          <div className="modal-right-section">
            <div className="modal-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Eliminar Tarea
              </button>
              <button className="close-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
            <div className="modal-stars-box">
            <label>Prioridad</label>
              <div className="modal-stars">
                
                {[1, 2, 3, 4, 5].map((index) => (
                  <FaStar
                    key={index}
                    color={index <= taskPriority ? "gold" : "lightgray"}
                    size={20}
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={() => handlePriorityChange(index)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-status">
              <label>Estado:</label>
              <select
                className="status-select"
                value={selectedEstado}
                onChange={handleChangeEstado}>
                {estados.map((estado) => (
                  <option key={estado.id_estado} value={estado.id_estado}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="dates">
              <label>Fecha de Inicio:</label>
              <input
                type="date"
                value={startDate || ""}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleSaveDates();
                }}
              />
            </div>
            <div className="dates">
              <label>Fecha de Finalización:</label>
              <input
                type="date"
                value={endDate || ""}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleSaveDates();
                }}
              />
            </div>
            <div>
              <h3>Usuarios Asignados:</h3>
              <ul>
                {taskUsers.map((user) => (
                  <li key={user.id_usuario}>
                    {user.nombre} {user.apellido}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

// import React, { createContext, useState, useEffect } from "react";

// // Crear el contexto
// export const TaskContext = createContext();

// // Proveedor del contexto
// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const [estados, setEstados] = useState([]); // Nuevo estado para los estados

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/api/estados/tareas");
//       const data = await response.json();
      
//       const filteredData = data.map(({ id_estado, Nombre, descripcion, nombre, id_tarea, Nombre_apellido, fecha_inicio, fecha_fin }) => ({
//         id_estado,
//         Nombre,
//         descripcion,
//         nombre,
//         id_tarea,
//         Nombre_apellido,
//         fecha_inicio,
//         fecha_fin
//       }));

//       // Extraer estados únicos
//       const uniqueEstados = Array.from(new Set(filteredData.map(task => task.id_estado)))
//         .map(id_estado => ({
//           id_estado,
//           nombre: filteredData.find(task => task.id_estado === id_estado).Nombre
//         }));

//     //   alert(JSON.stringify(filteredData, null, 2));  

//     setEstados(uniqueEstados);
//       setTasks(filteredData);  
//     } catch (err) {
//       console.error("Error al obtener las tareas:", err);
//     }
//   };

//   const updateTaskState = async (taskId, newStateId) => {
//     try {
//       const response = await fetch(`http://localhost:4000/api/tareas/${taskId}/estado`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id_estado: newStateId })
//       });

//       if (!response.ok) {
//         throw new Error('Error al actualizar el estado de la tarea');
//       }

//       // Actualizar el estado local
//       setTasks(prevTasks => 
//         prevTasks.map(task => 
//           task.id_tarea === taskId 
//             ? { ...task, id_estado: newStateId }
//             : task
//         )
//       );

//       // Recargar las tareas para asegurar sincronización
//       await fetchTasks();
//     } catch (error) {
//       console.error("Error al actualizar el estado:", error);
//       alert("Error al actualizar el estado de la tarea");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <TaskContext.Provider value={{ tasks, estados, updateTaskState }}>
//       {children}
//     </TaskContext.Provider>
//   );
// };