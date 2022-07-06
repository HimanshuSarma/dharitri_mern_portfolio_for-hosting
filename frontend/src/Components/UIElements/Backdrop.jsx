import React from 'react';

import './Backdrop.css';

const Backdrop = (props) => {

  return (
    <div style={{
        position: 'fixed',
        zIndex: '200',
        top: '0',
        left: '0',
        width: 'calc(100vw - 17px)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.55)'
    }}>

      {props.children}

    </div>
  )
}

export default Backdrop