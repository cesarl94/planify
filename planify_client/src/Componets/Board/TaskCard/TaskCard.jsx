import React from 'react';
import PropTypes from 'prop-types';
import './TaskCard.css';

const TaskCard = ({ description, priority, users }) => {
    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`star ${index < priority ? 'filled' : ''}`}>
                ★
            </span>
        ));
    };

    const renderUsers = () => {
        return users.map((user, index) => (
            <img
                key={index}
                src={user.avatarUrl}
                alt=""
                className="user-avatar"
            />
        ));
    };

    return (
        <div className="task-card">
            <p className="description">{description}</p>
            <div className="task-details">
                <div className="priority">{renderStars()}</div>
                <div className="users">{renderUsers()}</div>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    description: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default TaskCard;