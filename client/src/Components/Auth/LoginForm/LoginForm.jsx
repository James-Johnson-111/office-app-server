import react, { Component } from 'react';

import './LoginForm.css';
import * as passwordHash from 'password-hash';
import axios from '../../../axios-instance';
import Cookies from 'js-cookie';
import Loading from '../../UI/Loading/Loading';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class LoginForm extends Component {

    constructor( props )
    {

        super( props );
        this.state = {
            userInfo: {
                loginID: null,
                loginPass: null
            },
            loading: true
        }

    }

    componentDidMount()
    {

        this.setState( { loading: false } );

    }

    onChangeHandler = ( event ) => {

        const { name, value, type } = event.target;
        const setValues = {

            ...this.state.userInfo,
            [name]: value

        }
        this.setState( { userInfo: setValues } );

    }

    userLogin = ( event ) => {

        this.setState( { loading: true } );

        event.preventDefault();
        const Data = {
            loginID: this.state.userInfo.loginID,
            loginPass: this.state.userInfo.loginPass
        }

        axios.get( '/getuser' ).then( response => {

            for( let key in response.data )
            {

                if( ( response.data[key].login_id == this.state.userInfo.loginID ) && passwordHash.verify( this.state.userInfo.loginPass, response.data[key].user_password ) )
                {

                    let date = new Date();
                    date.setTime(date.getTime()+(20*60*1000))
                    Cookies.set('LoginID', response.data[key].login_id, { expires: date });
                    Cookies.set('FirstVisit', 'User Visit Site First Time');
                    this.setState( { loading: false } );
                    this.props.history.push('/dashboard');

                }

            }

            if( Cookies.get('LoginID') == undefined )
            {

                this.setState({ loading: false });

                toast.dark("Invalid Credentials, No User Found", {
                    position: 'bottom-center',
                    progressClassName: 'success-progress-bar',
                    autoClose: 3000,
                });

            }

        } ).catch( error => {

            this.setState( { loading: false } );
            toast.dark("Network Error 500 please check your network connection", {
                position: 'top-center',
                progressClassName: 'success-progress-bar',
                autoClose: 3000,
            });

            $('input[type=password]').val( '' );

        } );

    }

    render()
    {

        return(

            <>
                <Loading show={this.state.loading} />
                <div className="loginForm d-grid">
                    <div className="loginForm-inner d-flex justify-content-center">
                        <div className="loginForm-content">
                            <form onSubmit={this.userLogin}>
                                <h3 className="mb-3">Login</h3>
                                <input
                                    type="text"
                                    className="form-control form-control-sm mb-3 rounded-0"
                                    placeholder="Your Login ID"
                                    name="loginID"
                                    onChange={this.onChangeHandler}
                                    required
                                />
                                <input
                                    type="password"
                                    className="form-control form-control-sm mb-3 rounded-0"
                                    placeholder="Your Password"
                                    name="loginPass"
                                    onChange={this.onChangeHandler}
                                    required
                                />
                                <div className="text-center">
                                    <button type="submit" className="btn btn-sm px-5 btns">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={3000} />
            </>

        );

    }

}

export default LoginForm;