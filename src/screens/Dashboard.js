import React from 'react';
import { connect } from 'react-redux';

import refresh from '../img/icon/refresh.png';

import './css/dashboard.css';

class Dashboard extends React.Component {

    render() {
        return (
            <div className='row dashRoot'>
                <div className='dashContent'>
                    <div className='row dashTopbar'>
                        <div className='row dashCard dashTopLeftCard' style={{ justifyContent: 'space-around' }}>
                            <div className='col dashStartTextContainer' style={{ alignItems: 'flex-start' }}>
                                <p className='dashStartText'>Start Full System Sync</p>
                                <p>status: {this.props.bkup.status}</p>
                            </div>
                            <button className='dashStartButton'>
                                <img className='dashStartIcon' src={refresh} alt='start' />
                            </button>
                        </div>
                        <div className='row dashCard dashTopRightCard' style={{ justifyContent: 'space-around' }}>
                            <div className='col dashStartTextContainer' style={{ alignItems: 'flex-start' }}>
                                <p className='dashStartText'>Selective Cloning</p>
                                <p>status: {this.props.bkup.status}</p>
                            </div>
                            <div className='col'>
                                <div className='row dashDeviceSelectContainer'>
                                    <p>From: </p>
                                    <select className='dashDeviceSelect'>

                                    </select>
                                </div>
                                <div className='row dashDeviceSelectContainer'>
                                    <p>To: </p>
                                    <select className='dashDeviceSelect'>

                                    </select>
                                </div>
                            </div>
                            <button className='dashStartButton'>
                                <img className='dashStartIcon' src={refresh} alt='start' />
                            </button>
                        </div>
                    </div>
                    <div className='row dashMain'>
                        <div className='col dashMainLeft'>
                            <div className='col dashCard dashLeftCard' style={{ justifyContent: 'center' }}>
                                <p className='dashTimeSinceText'>time since last backup: </p>
                                <p className='dashTimeSinceNum'>00:00:00:00</p>
                            </div>
                            <div className='dashCard dashLeftCard'>
                                <p>{this.props.fs.stats.free}</p>
                                <p>{this.props.fs.stats.size}</p>
                            </div>
                            <div className='dashCard dashLeftBottomCard'>

                            </div>
                        </div>
                        <div className='dashCard dashRightCard'>

                        </div>
                    </div>
                    <div className='bottomIndicator'>

                    </div>
                </div>
                <div className='col dashDetail'>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    acc: state.acc,
    bkup: state.bkup,
    fs: state.fs,
});

export default connect(mapStateToProps)(Dashboard);