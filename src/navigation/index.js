import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import SidebarBtn from '../components/SidebarBtn';
import { store } from '../redux/store';
import { setClient, setDirectory } from '../redux/action';
import Dashboard from '../screens/Dashboard';
import Files from '../screens/Files';
import History from '../screens/History';
import Login from '../screens/Login';
import Settings from '../screens/Settings';
import Statistics from '../screens/Statistics';

class Index extends React.Component {

    constructor() {
        super();
        this.state = {
            loggedIn: false,
        }
    }

    componentDidMount() {
        const client = new W3CWebSocket('ws://localhost:8000');
        client.onopen = () => store.dispatch(setClient(client));
        client.onmessage = message => {
            if (message.data === 'cnf')
                this.setState({ loggedIn: true });
        }
        store.dispatch(setDirectory({
            dirs: [],
            hdirs: [],
            files: [],
            hfiles: []
        }));
    }

    logout = () => this.setState({ loggedIn: false });

    render() {
        return (
            <>
                {this.state.loggedIn ?
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
                    </Router> :
                    <div className='root'>
                        <Login login={(u, p) => { this.props.connection.client.send('log' + u + ' ' + p) }} />
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    connection: state.connection,
});

export default connect(mapStateToProps)(Index);