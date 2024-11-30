// TaskModal.jsx
import React, { useContext } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import "./TaskModal.css";
import { TaskContext } from "../../../Context/TaskContext";

const TaskModal = ({ isOpen, onClose, task, ratings, handleRating }) => {
    const { estados, updateTaskState } = useContext(TaskContext);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-layout">
          <div className="modal-left-section">
            <div className="modal-header">
              <FaUser className="header-icon" />
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
            <div className="modal-stars">
              {[1, 2, 3, 4, 5].map((index) => (
                <FaStar
                  key={index}
                  color={
                    index <= (ratings[task.id_tarea] || 0)
                      ? "gold"
                      : "lightgray"
                  }
                  size={20}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating(task.id_tarea, index);
                  }}
                />
              ))}
            </div>

            <div className="modal-status">
            <label>Estado:</label>
            <select 
                className="status-select" 
                value={task.id_estado}
                onChange={async (e) => {
                    const newStateId = parseInt(e.target.value);
                    await updateTaskState(task.id_tarea, newStateId);
                }}
            >
                {estados.map(estado => (
                    <option key={estado.id_estado} value={estado.id_estado}>
                        {estado.nombre}
                    </option>
                ))}
            </select>
        </div>

            <div className="modal-dates">
              <p>Fecha de Inicio: {task.fecha_inicio}</p>
              <p>Fecha de Finalización: {task.fecha_fin}</p>
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
                    <button className="remove-member" title="Remove member">
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-member">Add New Member</button>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="close-button">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
