import axios from 'axios';
import React from 'react';

import makeClient from '../client';
import Lock from '../img/icon/lock.png';
import Server from '../img/icon/server.png';
import User from '../img/icon/user.png';
import { setClient, setLogin } from '../redux/action';
import { store } from '../redux/store';

import './css/login.css';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dir: '',
            username: '',
            password: '',
            prompt: '',
            repswd: '',
            signup: false,
        }

        this.handleDir = this.handleDir.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePswd = this.handlePswd.bind(this);
        this.handleRePswd = this.handleRePswd.bind(this);
    }

    componentDidMount() {
        const link = window.location.href;
        const marker = link.lastIndexOf('/');
        if (marker !== link.length - 1)
            window.location.href = link.substring(0, marker);
    }

    handleDir = event => this.setState({ dir: event.target.value });

    handleEmail = event => this.setState({ username: event.target.value });

    handlePswd = event => this.setState({ password: event.target.value });

    handleRePswd = event => this.setState({ repswd: event.target.value });

    login = () => {
        if (this.state.signup) {
            if (this.state.repswd === this.state.password) {
                axios.post(`http://${window.location.hostname}:42070/accounts/add`, {
                    username: this.state.username,
                    password: this.state.password,
                    rootDir: this.state.dir,
                })
                    .then(() => this.setState({ prompt: "Account Created - Login to Start Using", signup: false }))
                    .catch(() => this.setState({ prompt: "Username already taken" }));
            }
            else
                this.setState({ prompt: 'Passwords Don\'t Match' });
        }
        else {
            axios.get(`http://${window.location.hostname}:42070/accounts/`)
                .then(res => {
                    const account = res.data.filter(acc => acc.username === this.state.username)[0];
                    if (account !== undefined) {
                        if (account.password === this.state.password) {
                            store.dispatch(setLogin(account));
                            store.dispatch(setClient(makeClient(window.location.hostname, account)));
                        }
                        else
                            this.setState({ prompt: 'Incorrect Password' });
                    }
                    else
                        this.setState({ prompt: 'Account Not Registered' });
                });
        }
    }

    signup = () => this.setState({ signup: true });

    render() {
        return (
            <div className='loginRoot'>
                <div className='loginStrip'>
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
                    {this.state.signup && <>
                        <p className='noselect loginInputLabel'>Retype Password</p>
                        <div className='loginInputBox'>
                            <img className='loginIcons' src={Lock} alt='logo' />
                            <input className='loginInput' type='password' placeholder='Retype your password' onChange={this.handleRePswd} />
                        </div>
                        <p className='noselect loginInputLabel'>Raspberry PI Storage Root Directory</p>
                        <div className='loginInputBox'>
                            <img className='loginIcons' src={Server} alt='logo' />
                            <input className='loginInput' type='text' placeholder='/your/directory/here' onChange={this.handleDir} />
                        </div>
                    </>}
                    <div style={{ height: '3vh' }} />

                    <p>{this.state.prompt}</p>
                    <div style={{ height: '3vh' }} />

                    <button className='loginBtns loginBtn' onClick={this.login}>
                        <p>{this.state.signup ? 'CONFIRM' : 'LOGIN'}</p>
                    </button>
                    {!this.state.signup && (window.location.href.startsWith('http://192.168') || window.location.href.startsWith('http://localhost')) &&
                        <button className='loginBtns signupBtn' onClick={this.signup}>
                            <p>SIGN UP</p>
                        </button>
                    }
                </div>
            </div>
        )
    }
}