import React, { useContext } from 'react';
import './StatusCard.css';
import addtask from '../../../Images/icons/add-task.png';
import edit from '../../../Images/icons/edit.png';
import deleteicon from '../../../Images/icons/delete.png';
import { CardStatusContext } from '../../../Context/CardStatusContext';
import TaskCard from '../TaskCard/TaskCard';

const StatusCard = () => {

    const {titles} = useContext(CardStatusContext)
    return (
        <div className="StatusCard-scroll">
            {titles.map((title, index) => (
              
                <div key={index} className="StatusCard-container">
                    <div className="TitleStatus-container">
                        <h3>{title}</h3>
                        <div>
                            <button className="StatusCard-Button">
                                <img src={addtask} className="iconstatus" alt="Add task" />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={edit} className="iconstatus" alt="Edit" />
                            </button>
                            <button className="StatusCard-Button">
                                <img src={deleteicon} className="iconstatus" alt="Delete" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatusCard;

