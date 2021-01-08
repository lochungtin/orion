import React from 'react';
import { Provider } from 'react-redux';

import { store } from './redux/store';
import Index from './navigation/index';

import './App.css';

export default class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}