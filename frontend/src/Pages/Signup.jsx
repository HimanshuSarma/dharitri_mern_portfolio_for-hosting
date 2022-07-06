import React,  {useState, useEffect} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import FormInput from '../Components/UIElements/FormInput';
import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';
import {eyeIcon} from '../assets/icons';

import './Signup.css';

import {signupFormInitState} from '../InitData/InitData';
import {signupFormInputs} from '../Data/FormInputs';

import {createUserAction} from '../redux/ActionCreators/userActions';

const Signup = () => {

  const [image, setImage] = useState();
  const [formInputsState, setFormInputsState] = useState(signupFormInputs);
  const [formState, setFormState] = useState(signupFormInitState);
  const [userDetailsValidity, setUserDetailsValidity] = useState(true);
  const [willNavigate, setWillNavigate] = useState(false);
  const {userDataReceived, isLoading} = useSelector(store => store.userState);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const changeUserDetailsValidity = (updatedState) => {
    setUserDetailsValidity(updatedState);
  }

  const changeWillNavigate = (updatedState) => {
    setWillNavigate(updatedState);
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    dispatch(createUserAction(formState, changeUserDetailsValidity, changeWillNavigate));
    setImage(null);
  }

  useEffect( () => {
    if(image) {
      getBase64(image, (result) => {
        setFormState((formState) => {return {...formState, photo: result}});
      });
    }
    
  },  [image]);

  useEffect(() => {
    if(willNavigate) {
      navigate('/userID');
    } else if(!userDetailsValidity && userDataReceived) {
      setFormState(signupFormInitState);
    }
  }, [willNavigate, userDetailsValidity, userDataReceived, navigate]);

  return (
    <>
    {isLoading && <Backdrop>
      <LoadingSpinner />
    </Backdrop>}
    <div className='signup-page-whole-screen-wrapper'>
      <div className='signup-form-wrapper'>
        <h2 className='signup-form-header'>Sign Up</h2>
        <p className='signup-form-caption roboto-font'>Please fill in the following details</p>
        <div className='signup-form-separator-line'></div>
        <form className='signup-form'>

          {formInputsState.map((formInput, index) => {
            return (
              <React.Fragment key={index}>
                <FormInput htmlFor={formInput.property} label={formInput.label} value={formState[formInput.property]}
                  property={formInput.property} type={formInput.type} accept={formInput.accept ? formInput.accept : ''}
                  setFormState={formInput.property !== 'photo' ? setFormState : (formInput.property === 'photo' ? viewChosenImage : null)} 
                  setFormInputsState={formInput.property === 'password' ? setFormInputsState : null}
                  inputIcon={formInput.property === 'password' ? eyeIcon : null}
                  state={formInput.property === 'password' ? formInput.state : null}
                />
              </React.Fragment>
            )
          })}

          {/* <label htmlFor="Name" className='signup-form-input-label'>Name</label>
          <input value={formState.name} onChange={(event) => setFormState((formState) => {return {...formState, name: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Name" className='signup-form-input-label'>Password</label>
          <input value={formState.password} onChange={(event) => setFormState((formState) => {return {...formState, password: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Phone Number" className='signup-form-input-label'>Phone Number</label>
          <input value={formState.phone_number} onChange={(event) => setFormState((formState) => {return {...formState, phone_number: event.target.value}})} className='signup-form-input' type='number' />
          <label htmlFor="State" className='signup-form-input-label'>State</label>
          <input value={formState.state} onChange={(event) => setFormState((formState) => {return {...formState, state: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="District" className='signup-form-input-label'>District</label>
          <input value={formState.district} onChange={(event) => setFormState((formState) => {return {...formState, district: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Town_City" className='signup-form-input-label'>Town/City</label>
          <input value={formState.town_city} onChange={(event) => setFormState((formState) => {return {...formState, town_city: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Business Address" className='signup-form-input-label'>Business Address</label>
          <input value={formState.business_add} onChange={(event) => setFormState((formState) => {return {...formState, business_add: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Post_Office" className='signup-form-input-label'>Post_Office</label>
          <input value={formState.post_office} onChange={(event) => setFormState((formState) => {return {...formState, post_office: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Pincode" className='signup-form-input-label'>Pincode</label>
          <input value={formState.pincode} onChange={(event) => setFormState((formState) => {return {...formState, pincode: event.target.value}})} className='signup-form-input' type='number' />
          <label htmlFor="Time_of_business" className='signup-form-input-label'>Time of business</label>
          <input value={formState.time_of_business} onChange={(event) => setFormState((formState) => {return {...formState, time_of_business: event.target.value}})} className='signup-form-input' type='time' />
          <label htmlFor="Price" className='signup-form-input-label'>Price</label>
          <input value={formState.price} onChange={(event) => setFormState((formState) => {return {...formState, price: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Pan_number" className='signup-form-input-label'>Pan number</label>
          <input value={formState.pan_number} onChange={(event) => setFormState((formState) => {return {...formState, pan_number: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Aadhar" className='signup-form-input-label'>Aadhar</label>
          <input value={formState.aadhar_number} onChange={(event) => setFormState((formState) => {return {...formState, aadhar_number: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Bank" className='signup-form-input-label'>Bank</label>
          <input value={formState.bank_upi} onChange={(event) => setFormState((formState) => {return {...formState, bank_upi: event.target.value}})} className='signup-form-input' type='text' />
          <label htmlFor="Image" className='signup-form-input-label'>Image</label>
          <input onChange={viewChosenImage} className='signup-form-input' type='file' accept='image/gif, image/jpeg, image/png' /> */}
          {formState.photo && <img className='signup-photo-preview' src={formState.photo} alt="" />}

          <button onClick={formSubmitHandler} className='signup-form-submit-btn roboto-font rounded-dark-green-background-white-text-btn'>Submit</button>

          <NavLink className='signup-page-login-btn' to='/login'>Already have an account? Go to login page</NavLink>

          {!userDetailsValidity && userDataReceived && <p>An error occured while signing up. Please sign up again</p>}
        </form>
      </div>
    </div>
    </>
  )
}

export default Signup