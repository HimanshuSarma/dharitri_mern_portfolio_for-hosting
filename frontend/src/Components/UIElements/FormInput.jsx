import React from 'react';

import './FormInput.css';

const FormInput = ({htmlFor, label, value, property, type, setFormState, setFormInputsState, accept, inputIcon, state}) => {

  return (
    <div className={`${property === 'photo' ? 'photo-input': ''}`}>
        <label htmlFor={htmlFor} className='signup-form-input-label roboto-font'>{label}</label>
        <div className='input-wrapper'>
            <input value={property !== 'photo' ? value : undefined} 
                onChange={(event) => {
                if(property !== 'photo') {
                    if(type === 'number') {
                        setFormState((formState) => {return {...formState, [property]: parseInt(event.target.value)}})
                    } else {
                        setFormState((formState) => {return {...formState, [property]: event.target.value}});
                    }
                } else if(property === 'photo') {
                    if(event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png' || 
                    event.target.files[0].type === 'image/avif' || event.target.files[0].type === 'image/gif') {
                        // setFormState is viewChosenImage if property is photo
                        setFormState(event);
                    } else {
                        // Write logic to inform the user that the selected file is not an image file of the reqd types...
                    }
                } 
            }} className={property !== 'photo' ? 'signup-form-input form-input' : ''} type={type}
            
            accept={property === 'photo' ? accept : null}
            >
            </input>

            {inputIcon && <img onClick={() => {
                setFormInputsState(formInputsState => {
                    return formInputsState.map((formInput) => {
                        if(formInput.property === 'password') {
                            if(formInput.type === 'text') return {...formInput, type: 'password'};
                            else return {...formInput, type: 'text'};
                        } else {
                            return formInput;   
                        }
                    })
                })
            }} className='input-eye-icon' src={inputIcon} alt="" /> }
        </div>
    </div>
  )
}

export default FormInput;