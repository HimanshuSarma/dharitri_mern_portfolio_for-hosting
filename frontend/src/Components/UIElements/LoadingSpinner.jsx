import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner-anim' style={{
        width: '10rem',
        height: '10rem',
        backgroundColor: 'transparent',
        position: 'relative',
      }}>

        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '50%',
          height: '50%',
          borderTopLeftRadius: '100%',
          backgroundColor: 'transparent',
          borderTop: '3px solid rgba(255,255,255,0.7)'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '50%',
          height: '50%',
          borderTopRightRadius: '100%',
          backgroundColor: 'transparent',
          borderTop: '3px solid rgba(255,255,255,0.7)',
          borderRight: '3px solid rgba(255,255,255,0.7)'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '50%',
          right: '0',
          width: '50%',
          height: '50%',
          borderBottomRightRadius: '100%',
          backgroundColor: 'transparent',
          borderRight: '3px solid rgba(255,255,255,0.7)',
          borderBottom: '3px solid rgba(255,255,255,0.7)'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          width: '50%',
          height: '50%',
          borderBottomLeftRadius: '100%',
          backgroundColor: 'transparent',
          borderBottom: '3px solid rgba(255,255,255,0.7)'
        }}></div>
    </div>
  )
}

export default LoadingSpinner