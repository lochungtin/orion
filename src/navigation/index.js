import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import SidebarBtn from '../components/SidebarBtn';
import Dashboard from '../screens/Dashboard';
import Files from '../screens/Files';
import History from '../screens/History';
import Login from '../screens/Login';
import Settings from '../screens/Settings';
import Statistics from '../screens/Statistics';
import { setLogout } from '../redux/action';
import { store } from '../redux/store';

class Index extends React.Component {

    constructor() {
        super();
    }

    logout = () => {
        store.dispatch(setLogout());
        window.location = 'http://localhost:3000/'
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
                            <nav>
                                <div className='sidebarEnds'>
                                    <p className='sidebarCornerText'>orion.</p>
                                </div>
                                <div className='sidebarBtns'>
                                    <SidebarBtn text={'dashboard'} />
                                    <SidebarBtn text={'files'} />
                                    <SidebarBtn text={'history'} />
                                    <SidebarBtn text={'statistics'} />
                                    <SidebarBtn text={'settings'} />
                                </div>
                                <div className='sidebarEnds'>
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
                                    <Route exact path='/history' component={History} />
                                    <Route exact path='/statistics' component={Statistics} />
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
    acc: state.acc
});

export default connect(mapStateToProps)(Index);