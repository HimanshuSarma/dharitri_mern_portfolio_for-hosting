import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentWrapper from '../Components/UIElements/ContentWrapper';

import './UserID.css';

const UserID = () => {
  const {userDetails} = useSelector(state => state.userState);

  return (
    <>
      <div className='userid-page-whole-screen-wrapper'>
        <ContentWrapper className='userid-page-wrapper'>
          {userDetails && userDetails._id && <div className='userid-page-profile-wrapper'>
              {userDetails.photo && <img className='userid-page-userprofilepic' src={userDetails.photo} alt="" />}
              {userDetails.name && <h3 className='userid-page-username'>{userDetails.name}</h3>}
              {userDetails.phone_number && <p className='userid-page-phone'>Phone: {userDetails.phone_number}</p>}
              {userDetails.state && <p className='userid-page-state'>State: {userDetails.state}</p>}
              {userDetails.district && <p className='userid-page-district'>District: {userDetails.district}</p>}
              {userDetails.town_city && <p className='userid-page-town_city'>Town/City: {userDetails.town_city}</p>}
              {userDetails.business_add && <p className='userid-page-business_add'>{userDetails.business_add}</p>}
              {userDetails.post_office && <p className='userid-page-post_office'>{userDetails.post_office}</p>}
              {userDetails.pincode && <p className='userid-page-pincode'>{userDetails.pincode}</p>}
              {userDetails.time_of_business && <p className='userid-page-time_of_business'>{userDetails.time_of_business}</p>}
              {userDetails.price && <p className='userid-page-price'>{userDetails.price}</p>}
              {userDetails.pan_number && <p className='userid-page-pan_number'>{userDetails.pan_number}</p>}
              {userDetails.aadhar_number && <p className='userid-page-aadhar_number'>{userDetails.aadhar_number}</p>}
              {userDetails.bank_upi && <p className='userid-page-bank_upi'>{userDetails.bank_upi}</p>}
          </div>}
          {!userDetails && <>
            <NavLink to='/signup'>Go to Signup page</NavLink>
            <NavLink className='userid-page-login-btn' to='/login'>Already have an account? Go to Login page</NavLink>
          </>}
        </ContentWrapper>
      </div>
    </>
  )
}

export default UserID