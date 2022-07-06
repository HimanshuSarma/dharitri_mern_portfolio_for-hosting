import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFormInitState } from '../InitData/InitData';
import {loginUserAction} from '../redux/ActionCreators/userActions';
import {getUserDefaultProductsPage} from '../redux/ActionCreators/userActions';

import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';
import { eyeIcon } from '../assets/icons';

import './Login.css'; 

const Login = () => {

    const [formState, setFormState] = useState(loginFormInitState);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isLoggedInState = useSelector(store => store.isLoggedInState);
    const {isLoading} = useSelector(store => store.userState);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userProductsPage = useSelector(store => store.userProductsPage);

    const passwordInput = useRef();

    const loginPasswordInputStateHandler = () => {
        if(passwordInput.current.type === 'text') passwordInput.current.type = 'password';
        else if(passwordInput.current.type === 'password') passwordInput.current.type = 'text';
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(loginUserAction(formState, setIsLoggedIn));
    }

    useEffect(() => {
        if(isLoggedIn && userProductsPage) {
            navigate(`/products?page=${userProductsPage}`);
        } else if(isLoggedIn && !userProductsPage) {
            // dispatch(getUserDefaultProductsPage());
        }
    }, [isLoggedIn, userProductsPage, navigate]);

    return (
        <>
        {isLoading && <Backdrop><LoadingSpinner /></Backdrop>}
        <div className='login-page-whole-screen-wrapper'>
            <div className='login-form-wrapper'>
                <h2 className='login-form-header'>Log In</h2>
                <p className='login-form-caption roboto-font'>Please fill in the following details</p>
                <div className='login-form-separator-line'></div>
                <form>
                <label htmlFor="Name" className='login-form-input-label'>Name</label>
                <div className='login-form-input-wrapper'>
                    <input value={formState.name} onChange={(event) => {setFormState(formState => {return {...formState, name: event.target.value}})}} className='login-form-input form-input roboto-font' type='text' />
                </div>
                <label htmlFor="Phone" className='login-form-input-label'>Phone</label>
                <div className='login-form-input-wrapper'>
                    <input value={formState.phone_number} onChange={(event) => {setFormState(formState => {return {...formState, phone_number: event.target.value}})}} className='login-form-input form-input roboto-font' type='number' />
                </div>
                <label htmlFor="Password" className='login-form-input-label'>Password</label>
                <div className='login-form-input-wrapper flex-align-items-center login-form-password-input-wrapper'>
                    <input ref={passwordInput} value={formState.password} onChange={(event) => {setFormState(formState => {return {...formState, password: event.target.value}})}} className='login-form-input form-input roboto-font' type='text' />
                    <img onClick={loginPasswordInputStateHandler} className='login-form-input-eye-icon' src={eyeIcon} alt="" />
                </div>

                <button onClick={formSubmitHandler} className='login-form-submit-btn rounded-dark-green-background-white-text-btn roboto-font'>Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login
