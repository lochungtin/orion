import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import SidebarBtn from '../components/SidebarBtn';
import Dashboard from '../screens/Dashboard';
import Files from '../screens/Files';
import Login from '../screens/Login';
import Settings from '../screens/Settings';
import { setLogout } from '../redux/action';
import { store } from '../redux/store';

class AppNav extends React.Component {

    logout = () => {
        this.props.clt.close();
        store.dispatch(setLogout());
    }

    render() {
        return (
            <>
                {this.props.acc === null ?
                    <div className='root'>
                        <Login />
                    </div> :
                    <Router>
                        <div className='root'>
                            <nav className='col'>
                                <div className='row sidebarEnds'>
                                    <p className='sidebarCornerText noselect'>orion.</p>
                                </div>
                                <div className='col sidebarBtns' style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                    <SidebarBtn text={'dashboard'} />
                                    <SidebarBtn text={'files'} />
                                    <SidebarBtn text={'settings'} />
                                </div>
                                <div className='row sidebarEnds'>
                                    <button className='logoutBtn' onClick={this.logout}>
                                        <p>logout</p>
                                    </button>
                                </div>
                            </nav>

                            <Switch>
                                <Route
                                    exact
                                    path='/'
                                    render={() => <Redirect to='/dashboard' />}
                                />
                                <div className='content'>
                                    <Route exact path='/dashboard' component={Dashboard} />
                                    <Route exact path='/files' component={Files} />
                                    <Route exact path='/settings' component={Settings} />
                                </div>
                            </Switch>
                        </div>
                    </Router>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    acc: state.acc,
    clt: state.clt,
});

export default connect(mapStateToProps)(AppNav);