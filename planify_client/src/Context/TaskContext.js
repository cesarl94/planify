import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const TaskContext = createContext();

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [estados, setEstados] = useState([]);

  // Con esto no trae todas las tareas

  // const fetchTasks = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/api/estados/tareas");
  //     const data = await response.json();
      
  //     const filteredData = data.map(({ id_estado, Nombre, descripcion, nombre, id_tarea, Nombre_apellido, fecha_inicio, fecha_fin }) => ({
  //       id_estado,
  //       Nombre,
  //       descripcion,
  //       nombre,
  //       id_tarea,
  //       Nombre_apellido,
  //       fecha_inicio,
  //       fecha_fin
  //     }));

  //     // Extraer estados únicos
  //     const uniqueEstados = Array.from(new Set(filteredData.map(task => task.id_estado)))
  //       .map(id_estado => ({
  //         id_estado,
  //         nombre: filteredData.find(task => task.id_estado === id_estado).Nombre
  //       }));

  //   //   alert(JSON.stringify(filteredData, null, 2));  

  //   setEstados(uniqueEstados);
  //     setTasks(filteredData);  
  //   } catch (err) {
  //     console.error("Error al obtener las tareas:", err);
  //   }
  // };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/board");

      const data = await response.json();

      const flattenedTasks = data.estados.flatMap((estado) =>
        estado.tareas.map((tarea) => ({
          ...tarea,

          id_estado: estado.id_estado,

          estado_nombre: estado.nombre,
        }))
      );

      setTasks(flattenedTasks);
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch("http://localhost:4000/api/newtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Error creating task");
      }

      const newTask = await response.json();

      await fetchTasks();

      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const fetchTaskUsers = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/task/${taskId}/users`
      );
      if (!response.ok) {
        throw new Error("Error fetching task users");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching task users:", error);
      return []; // Retorna un array vacío en caso de error
    }
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/task/${taskId}`);

      if (!response.ok) {
        throw new Error("Error fetching task details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching task details:", error);

      throw error;
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/estados");
      const data = await response.json();
      setEstados(data);
    } catch (err) {
      console.error("Error al obtener los estados:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:4000/api/task/${taskId}`, {
        method: "DELETE",
      });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id_tarea !== taskId)
      );
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const updateTaskDates = async (taskId, startDate, endDate) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/task/${taskId}/dates`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ fecha_inicio: startDate, fecha_fin: endDate }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar las fechas");
      }

      await fetchTasks(); // Recargar tareas para asegurar el estado actualizado
    } catch (error) {
      console.error("Error al actualizar las fechas:", error);

      throw error;
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

  const updateTaskPriority = async (taskId, priority) => {
    try {
      console.log(`Actualizando prioridad de la tarea ${taskId} a ${priority}`); // Agregado para depuración

      const response = await fetch(
        `http://localhost:4000/api/task/${taskId}/priority`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ prioridad: priority }),
        }
      );

      console.log("Respuesta de la API:", response);
      if (!response.ok) {
        throw new Error("Error al actualizar la prioridad");
      }

      await fetchTasks(); // Recargar tareas para asegurar el estado actualizado
    } catch (error) {
      console.error("Error al actualizar la prioridad:", error);

      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();

    fetchEstados();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,

        estados,

        deleteTask,

        updateTaskDates,

        updateTaskState,

        fetchTaskUsers,

        addTask,

        updateTaskPriority,

        fetchTaskDetails
      }}>
      {children}
    </TaskContext.Provider>
  );
};

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
