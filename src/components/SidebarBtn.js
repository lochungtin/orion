import React from 'react';
import { Link } from "react-router-dom";

import './css/SidebarBtn.css'

export default class SidebarBtn extends React.Component {

    render() {
        return (
            <Link className='sidebarBtn' to={'/' + this.props.text}>
                <p className='sidebarText'>{this.props.text}</p>
            </Link>
        );
    }
}