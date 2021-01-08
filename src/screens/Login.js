import React from 'react';
import { connect } from 'react-redux';

import User from '../img/icon/user.png';
import Lock from '../img/icon/lock.png';

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            pswd: '',
            repswd: '',
            signup: false,
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePswd = this.handlePswd.bind(this);
    }

    handleEmail = event => this.setState({ email: event.target.value });

    handlePswd = event => this.setState({ pswd: event.target.value });

    login = () => this.props.login(this.state.email, this.state.pswd);

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

const mapStateToProps = state => ({
    connection: state.connection,
});

export default connect(mapStateToProps)(Login);