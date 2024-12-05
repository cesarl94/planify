// TaskModal.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaStar, FaUser, FaCalendar } from "react-icons/fa";
import { BiSolidTrash, BiX, BiFile } from "react-icons/bi";
import "./TaskModal.css";
import { TaskContext } from "../../../Context/TaskContext";
import { CardStatusContext } from "../../../Context/CardStatusContext";
import moment from "moment";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.css";
import $ from "jquery";
import "bootstrap-datepicker";

const TaskModal = ({ isOpen, onClose, task }) => {
  const { updateTaskPriority, updateTaskState, deleteTask, tasks } =
    useContext(TaskContext);
  const { titles } = useContext(CardStatusContext);
  //Actualiza las estrellas
  const updatedTask = tasks.find((t) => t.id_tarea === task.id_tarea) || task;

  // Estado local para el estado de la tarea
  const [currentState, setCurrentState] = useState(task.id_estado);
  const [startDate, setStartDate] = useState(task.fecha_creacion);
  const [endDate, setEndDate] = useState(task.fecha_fin);

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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-layout">
          <div className="modal-left-section">
            <div className="modal-header">
              <BiFile className="header-icon" />
              <input
                type="text"
                value={task.nombre}
                readOnly
                className="modal-title"
              />
            </div>
            <textarea
              value={task.descripcion}
              readOnly
              className="modal-description"
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
              <p>Prioridad</p>
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
              <label>Estado:</label>
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

            <div className="modal-dates">
              <div className="dates-horizontal">
                <div className="dates-vertical">
                  <p>Fecha de Inicio:</p>

                  <p>
                    {startDate
                      ? moment(startDate).format("MMM Do YY")
                      : "No asignada"}
                  </p>
                </div>

                <input className="calendar-icon start-datepicker" />
              </div>

              <div className="dates-horizontal">
                <div className="dates-vertical">
                  <p>Fecha de Finalización:</p>

                  <p>
                    {endDate
                      ? moment(endDate).format("MMM Do YY")
                      : "No asignada"}
                  </p>
                </div>

                <input className="calendar-icon end-datepicker" />
              </div>
            </div>

            <div className="modal-members">
              <h4>Members:</h4>
              <div className="members-list">
                {task.Nombre_apellido.map((nombre, idx) => (
                  <div key={idx} className="member-item">
                    <div className="member-info">
                      <FaUser className="member-icon" />
                      <span>{nombre}</span>
                    </div>
                    
                    <button className="remove-member" title="Remove member" onClick={() => alert(`Eliminó a ${task.id_usuario}`)}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-member">Add New Member</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
