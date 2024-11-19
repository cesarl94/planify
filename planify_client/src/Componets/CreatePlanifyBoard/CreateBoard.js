import React from 'react'
import addstate from '../../Images/icons/add-state.png'
import './CreateBoard.css'
const CreateBoard = () => {
    return (
        <div>
            <button className='CreateBoard-Container' onClick={() => alert('CREACION!!!!')}>
                <img src={addstate} className='addstateicon'></img>

                <p className='CreateBoard-Title'>Planify board</p>
            </button>
        </div>
    )
}

export default CreateBoard
