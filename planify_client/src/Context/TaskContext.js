import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const TaskContext = createContext();

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [estados, setEstados] = useState([]); // Nuevo estado para los estados

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/estados/tareas");
      const data = await response.json();
      
      const filteredData = data.map(({ id_estado, Nombre, descripcion, nombre, id_tarea, Nombre_apellido, fecha_inicio, fecha_fin }) => ({
        id_estado,
        Nombre,
        descripcion,
        nombre,
        id_tarea,
        Nombre_apellido,
        fecha_inicio,
        fecha_fin
      }));

      // Extraer estados únicos
      const uniqueEstados = Array.from(new Set(filteredData.map(task => task.id_estado)))
        .map(id_estado => ({
          id_estado,
          nombre: filteredData.find(task => task.id_estado === id_estado).Nombre
        }));

    //   alert(JSON.stringify(filteredData, null, 2));  

    setEstados(uniqueEstados);
      setTasks(filteredData);  
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
    }
  };

  const updateTaskState = async (taskId, newStateId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tareas/${taskId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_estado: newStateId })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la tarea');
      }

      // Actualizar el estado local
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id_tarea === taskId 
            ? { ...task, id_estado: newStateId }
            : task
        )
      );

      // Recargar las tareas para asegurar sincronización
      await fetchTasks();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado de la tarea");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, estados, updateTaskState }}>
      {children}
    </TaskContext.Provider>
  );
};
