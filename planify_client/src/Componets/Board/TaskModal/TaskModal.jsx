// TaskModal.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaStar, FaUser, FaRegCalendarAlt } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { BiSolidTrash, BiX, BiFile } from "react-icons/bi";
import "./TaskModal.css";
import { TaskContext } from "../../../Context/TaskContext";
import { MemberContext } from "../../../Context/MemberContext";
import { CardStatusContext } from "../../../Context/CardStatusContext";
import moment from "moment";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.css";
import $ from "jquery";
import "bootstrap-datepicker";

const TaskModal = ({ isOpen, onClose, task }) => {
  const { members, addMemberToTask } = useContext(MemberContext);
  const {
    updateTaskField,
    updateTaskPriority,
    updateTaskState,
    deleteTask,
    tasks,
  } = useContext(TaskContext);
  const { titles } = useContext(CardStatusContext);
  //Actualiza las estrellas

  const updatedTask = tasks.find((t) => t.id_tarea === task.id_tarea) || task;

  // Estado local para el estado de la tarea
  const [currentState, setCurrentState] = useState(task.id_estado);
  const [startDate, setStartDate] = useState(task.fecha_creacion);
  const [endDate, setEndDate] = useState(task.fecha_fin);
  // const [newMemberId, setNewMemberId] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    setCurrentState(task.id_estado);

    setStartDate(task.fecha_creacion || null);

    setEndDate(task.fecha_limite || null); // Asegúrate de que tenga un valor por defecto
  }, [task]);

  useEffect(() => {
    $(".start-datepicker")
      .datepicker({
        format: "mm/dd/yyyy",

        autoclose: true,
      })

      .on("changeDate", (e) => {
        setStartDate(moment(e.date).format("YYYY-MM-DD")); // Guarda la fecha en un formato estándar
      });

    $(".end-datepicker")
      .datepicker({
        format: "mm/dd/yyyy",

        autoclose: true,
      })

      .on("changeDate", (e) => {
        setEndDate(moment(e.date).format("YYYY-MM-DD")); // Guarda la fecha en un formato estándar
      });
  }, []);

  // Cerrar el modal al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleStateChange = async (e) => {
    const newStateId = parseInt(e.target.value);
    if (currentState !== newStateId) {
      await updateTaskState(task.id_tarea, newStateId);
      setCurrentState(newStateId); // Actualiza el estado local
    }
  };

  const handleUpdateName = async (taskId, name) => {
    if (name === "") return;
    await updateTaskField(taskId, { nombre: name });
  };

  const handleUpdateDescripcion = async (taskId, descripcion) => {
    if (descripcion === "") return;
    await updateTaskField(taskId, { descripcion: descripcion });
  };

  //  const handleupdatename = async (taskId, name) =>{

  //   if(name === ''){ return };

  //    try{
  //     const response = await fetch(`http://localhost:4000/api/updatetask`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id_tarea: taskId, nombre: name }),
  //     });

  //     window.location.reload();

  //   }catch(error){

  //     console.error(`Error al actualizar nombre`,error)
  //    }
  //  }

  //  const handleupdatedescripcion = async (taskId, descripcion) =>{

  //   if(descripcion === ''){ return };

  //   try{
  //    const response = await fetch(`http://localhost:4000/api/updatetask`, {
  //      method: "PATCH",
  //      headers: {
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify({ id_tarea: taskId, descripcion: descripcion }),
  //    });

  //    window.location.reload();

  //  }catch(error){

  //    console.error(`Error al actualizar nombre`,error)
  //   }
  // }

  const handleDeleteUser = async (idUsuario, idTarea) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/DeleteUsuario_tarea/${idUsuario}/${idTarea}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar:", errorData.mensaje);
        alert(`Error: ${errorData.mensaje}`);
        return;
      }

      const data = await response.json();
      window.location.reload();
      console.log("Usuario eliminado con éxito:", data);
    } catch (error) {
      console.error("Error de red o del servidor:", error);
    }
  };

  const handleAddMember = async () => {
    if (selectedMember) {
      await addMemberToTask(task.id_tarea, selectedMember.id_usuario);
      setSelectedMember(null); // Limpiar selección después de añadir
    } else {
      alert("Por favor, selecciona un usuario válido.");
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-layout">
          <div className="modal-left-section">
            <div className="modal-header">
              <BiFile className="header-icon" />
              <input
                type="text"
                placeholder={task.nombre}
                className="modal-title"
                onBlur={(e) => handleUpdateName(task.id_tarea, e.target.value)}
              />
            </div>
            <textarea
              placeholder={task.descripcion}
              className="modal-description"
              onBlur={(e) =>
                handleUpdateDescripcion(task.id_tarea, e.target.value)
              }
            />
          </div>
          <div className="modal-right-section">
            <div className="modal-buttons">
              <BiSolidTrash
                className="buttons"
                onClick={() => deleteTask(task.id_tarea)}
              />
              <BiX onClick={onClose} className="buttons" />
            </div>
            <div className="modal-stars">
              <p>Priority</p>
              <div>
                {[1, 2, 3, 4, 5].map((index) => (
                  <FaStar
                    key={index}
                    color={
                      index <= (updatedTask.prioridad || 0)
                        ? "gold"
                        : "lightgray"
                    }
                    size={20}
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTaskPriority(updatedTask.id_tarea, index);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="modal-status">
              <label>State:</label>
              <select
                className="status-select"
                value={currentState} // Usa el estado local
                onChange={handleStateChange}>
                {titles.map((estado) => (
                  <option key={estado.id_estado} value={estado.id_estado}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="dates-horizontal">
              <div className="dates-vertical">
                <p>Creation Date:</p>

                <p>
                  {startDate
                    ? moment(startDate).format("MMM Do YY")
                    : "Not assigned"}
                </p>
              </div>
              <FaRegCalendarAlt className="calendar-icon" />
            </div>

            <div className="dates-horizontal">
              <div className="dates-vertical">
                <p>End date:</p>

                <p>
                  <input
                    className="end-datepicker"
                    value={
                      endDate
                        ? moment(endDate).format("MMM Do YY")
                        : "Not asigned"
                    }
                    onChange={() => {}}
                  />
                </p>
              </div>
              <CgSandClock className="calendar-icon" />
            </div>

            <div className="modal-members">
              <p>Members:</p>
              <div className="members-list">
                {task.Nombre_apellido.map((nombre, idx) => (
                  <div key={idx} className="member-item">
                    <div className="member-info">
                      <FaUser className="member-icon" />
                      <span>{nombre}</span>
                    </div>
                    <button
                      className="remove-member"
                      title="Remove member"
                      onClick={() =>
                        handleDeleteUser(task.ids_usuario[idx], task.id_tarea)
                      }>
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <select
                onChange={(e) => {
                  const userId = parseInt(e.target.value);
                  const member = members.find(
                    (user) => user.id_usuario === userId
                  );
                  setSelectedMember(member || null); // Asegúrate de que sea null si no se encuentra
                }}>
                <option value="">Selecciona un usuario</option>
                {members.map((user) => (
                  <option key={user.id_usuario} value={user.id_usuario}>
                    {user.nombre} {user.apellido}
                  </option>
                ))}
              </select>
              <button className="add-member" onClick={handleAddMember}>
                Add New Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
