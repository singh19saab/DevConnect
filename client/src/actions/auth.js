import axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_FAIL, REGISTER_SUCCESS , USER_LOADED ,AUTH_ERROR  , LOGIN_SUCCESS , LOGIN_FAIL , LOGOUT , CLEAR_PROFILE} from './types'
import setAuthToken from '../utils/setAuthToken'

//Load user registration
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }

    try {
        const res =await axios.get('/api/auth')
        console.log(res)
        dispatch({ 
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type:AUTH_ERROR
        })
    }
}

//Register user 
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const response = await axios.post('/api/users', body, config)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data
        })
        dispatch(loadUser())
    } catch (error) {
        console.log(error)
        //Setting the alert
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(err => dispatch(
                setAlert(err.msg, "danger")
            ))
        }
        //Dispatching registration failure
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//login user 
export const login = ({email, password}) => async dispatch => {
    const config = {
        headers: { 'Content-Type': 'application/json' }
    }

    const body = JSON.stringify({ email , password });

    try {
        const response = await axios.post('/api/auth', body, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });
        dispatch(loadUser())
    } catch (error) {
        console.log(error)
        //Setting the alert
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(err => dispatch(
                setAlert(err.msg, "danger")
            ))
        }
        //Dispatching registration failure
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE})
    dispatch({type : LOGOUT})
}