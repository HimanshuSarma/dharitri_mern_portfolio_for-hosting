import React from 'react';

import './WhiteMessageCard.css';

const WhiteMessageCard = ({style, children, setSelectShippingAddressMessage}) => {
  return (
    <div onClick={(event) => {event.stopPropagation()}} style={style} className='white-message-card'>
        {children}

        <button onClick={() => setSelectShippingAddressMessage(null)} className='white-message-card-close flex'>
            <i className="fa-solid fa-xmark"></i>
        </button>
    </div>
  )
}

export default WhiteMessageCard