import './Header.css';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Backdrop from './UIElements/Backdrop';
import LoadingSpinner from './UIElements/LoadingSpinner';

import {userLogout} from '../redux/ActionCreators/userActions';
import {updateUserProductsPage} from '../redux/ActionCreators/userActions';

import {base64logo} from '../assets/base64logo';

const Header = () => {

  const [showAccountCard, setShowAccountCard] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const isLoggedInState = useSelector(store => store.isLoggedInState);
  const userProductsPage = useSelector(store => store.userProductsPage);

  const currentProductsPageQueryParam = parseInt(useLocation().search.split('=')[1]);

  const userAccountCard = useRef();

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(userLogout(setIsLogoutLoading));
  }

  useEffect(() => {
    if(userAccountCard.current) {
      if(showAccountCard) {
        userAccountCard.current.classList.add('show-user-account-card');
      } else {
        userAccountCard.current.classList.remove('show-user-account-card');
      }
    }
  }, [showAccountCard]);

  useEffect(() => {
    // Initialise the userProductsPage redux state to the products page query param...
    if(currentProductsPageQueryParam) { 
      dispatch(updateUserProductsPage(currentProductsPageQueryParam));
    } else if(!currentProductsPageQueryParam) { // If the products page query param is null or undefined or other 
                                                // invalid value, then initialise the userProductsPage to 1.
      dispatch(updateUserProductsPage(1));
    }
  }, []);


  return (
    <>
    {isLogoutLoading && <Backdrop>
      <LoadingSpinner />
    </Backdrop>}
    {userProductsPage !== null && (<header className='header-container width-limit-center'>
      <div className='header-flex-container'>
        <div className='header-logo-container'>
          <img className='header-logo' src={base64logo}/>
        </div>
        <div className='header-nav-btns-container'>
          {<NavLink to={`${isLoggedInState ? '/products?page=1' : '/signup'}`} className='header-nav-btn'>
            Home
          </NavLink>}
          <NavLink to={`/products?page=${userProductsPage}`} className='header-nav-btn'>
            All Products
          </NavLink>
          <NavLink to='/about' className='header-nav-btn'>
            About
          </NavLink>
          <NavLink to='/contact' className='header-nav-btn'>
            Contact
          </NavLink>
          <div className='header-account-btn-container' onMouseEnter={() => {setShowAccountCard(true)}}
            onMouseLeave={() => {setShowAccountCard(false)}}> 
            <NavLink to={`${isLoggedInState ? '/' : '/login'}`} className='header-nav-btn account-nav-btn'>
              Account
            </NavLink>

            <div className='user-account-card' ref={userAccountCard}>
              {!isLoggedInState && <NavLink to='/login' className='user-account-card-nav-btn'>Login</NavLink>}
              {!isLoggedInState && <NavLink to='/signup' className='user-account-card-nav-btn'>Don't have an account? Signup</NavLink>}
              {isLoggedInState && <button onClick={logoutHandler} className='user-account-logout-btn'>Logout</button>}
            </div>
          </div>
          <NavLink to='/cart'>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAClElEQVRoge2Yz0tUURTHP/c5TsQwbhKCNGrTxkBaBv0BLWqrEGTuysoENzpt7FERiRRhhCWukjYatayVi7DaFQlZq8BKsx+LGJsanzqnRTx0ptF377wfvsX7LB6ce8+Z+X7fu/eeeQMJCQkJ24kqi86ePAbcI1XfRPMeyGYB1oAPCGN8L97Etle3QeemWGWRcBdoYnUF5hfc0TrgAIpBdu+8H7E+TyzvlA2InGDk+tGQtNREuQElpxE+U18PzU3VK4RTEejSRnlmjFw7gljTEWjRw+IQXbk366EXXRdfgPoUqih9nmwUDzoGlBKk9Dg0SSaU1I3KIb1NrOoeBi7GGJnhfN9U5aiegW+/nwMLnnmhooZQSipH9QzYdgmRR4Fr0meexuJEtQn9PiBqMjA5pgi3aLedalP6Bn4Up4EvQWkyYAlnx9hmk/oGbLuEkuhPI1Gj9Pb+3Gza7KcERL2MVknJ8FYJZga+Lj/zJcecCc7kPm6VYGbAtku+5JhSsv5rXJWYLqEomaK775VXUnwNWCXPuw9xNSC8Z9F5qpMaTwOWDOnutzgaWGQl80A3OW4G5hHppKdnWbcg5fsrz+W83+pCJG5PwJhaDCyVRcODzcFIqY1aDMyWRSkZ5c7VvcHIMcd8/Y4MdiNyOwQt6xjsK/MnsOvPKPDauC4kzA202w5r6jgxMVHbKXShf4HG4mGgG1EvgV+BqjLA9xl+sK0tnc0vXxFUByAC44WG9MDbycmq77BB1br4bmSZvHNZUH1urKA/k3cAcmHWuvhuZIp/f/bub2llX0urO9YZdq1LEJ1Yyi+AsBZBLRCAAYFxgLnZGebezbifOh52rYvvPVBoSA9k8g4KOlxRhWz6Uti1CQkJCfHgL5gc0zcZwFXWAAAAAElFTkSuQmCC"/>
          </NavLink>
        </div>
      </div>
    </header>)}
    </>
  )
}

export default Header