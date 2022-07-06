import React, {useState, useEffect, useRef} from 'react';
import './SignupInputs.css';

const SignupInputs = ({labelText, inputType, inputAccept, getInputVal}) => {

  const imgInput = useRef();
  const nonImgInput = useRef();

  const [image, setImage] = useState();
  let profilePicBase64;

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

  const viewChosenImage = (event) => {
    setImage(event.target.files[0]);
  } 

  useEffect( () => {
    if(image) {
      getBase64(image, (result) => {
        getInputVal(result);
      });
    }
    
  },  [image]);

  return (
    <>
        <label htmlFor="Name" className='signup-form-input-label'>{labelText}</label>
        {inputAccept && <input ref={imgInput} onChange={viewChosenImage} className='signup-form-input' type={inputType} accept={inputAccept} />}
        {!inputAccept && <input ref={nonImgInput} className='signup-form-input' type={inputType} />}
        {profilePicBase64 && <img src={profilePicBase64} alt="" />}
    </>
  )
}

export default SignupInputs