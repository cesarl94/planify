import React, { createContext, useState, useEffect } from "react";

export const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error("Error al obtener los usuarios:", err);
    }
  };

  const addMemberToTask = async (taskId, userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/addusuario_tarea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_usuario: userId, id_tarea: taskId }),
      });

      if (!response.ok) {
        throw new Error("Error al añadir el miembro a la tarea");
      }

      // Aquí podrías recargar la lista de usuarios o tareas si es necesario
    } catch (error) {
      console.error("Error al añadir el miembro:", error);
      alert("Error al añadir el miembro a la tarea");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <MemberContext.Provider value={{ members, addMemberToTask }}>
      {children}
    </MemberContext.Provider>
  );
};