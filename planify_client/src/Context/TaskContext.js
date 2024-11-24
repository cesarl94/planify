import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const TaskContext = createContext();

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/estados/tareas");
      const data = await response.json();
      
      const filteredData = data.map(({ id_estado, Nombre, descripcion, nombre, id_tarea, Nombre_apellido}) => ({
        id_estado,
        Nombre,
        descripcion,
        nombre,
        id_tarea,
        Nombre_apellido
      }));

    //   alert(JSON.stringify(filteredData, null, 2));  

      setTasks(filteredData);  
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks }}>
      {children}
    </TaskContext.Provider>
  );
};
