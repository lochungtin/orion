import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import User from '../img/icon/user.png';
import Lock from '../img/icon/lock.png';
import { setLogin } from '../redux/action';
import { store } from '../redux/store';

export default class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            repswd: '',
            signup: false,
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePswd = this.handlePswd.bind(this);
    }

    handleEmail = event => this.setState({ username: event.target.value });

    handlePswd = event => this.setState({ password: event.target.value });

    login = () => {
        axios.get('http://localhost:5000/accounts/')
            .then(res => {
                var account = res.data.filter(acc => acc.username === this.state.username)[0];
                if (account !== undefined) {
                    if (account.password === this.state.password) 
                        store.dispatch(setLogin(account));
                }
            });
    }

    render() {
        return (
            <div className='loginRoot'>
                <div className='loginStrip'>
                    <div style={{ height: '20vh' }} />
                    <p className='noselect loginText'>orion.</p>
                    <div style={{ height: '2vh' }} />


                    <p className='noselect loginInputLabel'>Username</p>
                    <div className='loginInputBox'>
                        <img className='loginIcons' src={User} alt='logo' />
                        <input className='loginInput' type='text' placeholder='Type your username' onChange={this.handleEmail} />
                    </div>
                    <p className='noselect loginInputLabel'>Password</p>
                    <div className='loginInputBox'>
                        <img className='loginIcons' src={Lock} alt='logo' />
                        <input className='loginInput' type='password' placeholder='Type your password' onChange={this.handlePswd} />
                    </div>
                    <div style={{ height: '6vh' }} />

                    <button className='loginBtn' onClick={this.login}>
                        <p>LOGIN</p>
                    </button>
                </div>
            </div>
        )
    }
}