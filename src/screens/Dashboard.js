import { Line } from 'rc-progress';
import React from 'react';
import { connect } from 'react-redux';

import chevL from '../img/icon/left.png';
import fileE from '../img/icon/fileE.png'
import pc from '../img/icon/pc.png';
import plus from '../img/icon/plus.png';
import refresh from '../img/icon/refresh.png';
import { size } from '../utils/size';

import './css/dashboard.css';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            detailMode: '',
        }

        this.handleDeviceName = this.handleDeviceName.bind(this);
        this.handelDeviceRootDir = this.handelDeviceRootDir.bind(this);
    }

    addDevice = () => {

    }

    addDeviceMode = () => this.setState({ detailMode: 'dev' });

    cancelDetail = () => this.setState({ detailMode: '' });

    handleDeviceName = event => this.setState({ devName: event.target.value });

    handelDeviceRootDir = event => this.setState({ devRootDir: event.target.value });

    render() {
        return (
            <div className='row dashRoot'>
                <div className='dashContent'>
                    <div className='row dashTopbar'>
                        <div className='row dashCard dashTopLeftCard' style={{ justifyContent: 'space-around' }}>
                            <div className='col' style={{ alignItems: 'flex-start' }}>
                                <p className='dashStartText'>Start Full System Sync</p>
                                <p>status: {this.props.bkup.status}</p>
                            </div>
                            <button className='dashStartButton'>
                                <img className='dashStartIcon' src={refresh} alt='start' />
                            </button>
                        </div>
                        <div className='row dashCard dashTopRightCard' style={{ justifyContent: 'space-around' }}>
                            <div className='col' style={{ alignItems: 'flex-start' }}>
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
                            <div className='col dashCard dashLeftTopCard' style={{ justifyContent: 'center' }}>
                                <p className='dashLeftCardLabel'>time since last backup: </p>
                                <p className='dashTimeSinceNum'>00:00:00:00</p>
                            </div>
                            <div className='col dashCard dashLeftMiddleCard' style={{ justifyContent: 'space-around' }}>
                                <p className='dashLeftCardLabel'>drive usage and size: </p>
                                <div className='dashProgress'>
                                    <Line percent={(this.props.fs.stats.size - this.props.fs.stats.free) / this.props.fs.stats.size * 100} strokeWidth='2' strokeColor='#e6b329' />
                                </div>
                                <div className='row dashProgress'>
                                    <p>{size(this.props.fs.stats.size - this.props.fs.stats.free)}</p>
                                    <p> out of </p>
                                    <p>{size(this.props.fs.stats.size)}</p>
                                </div>
                            </div>
                            <div className='col dashCard dashLeftBottomCard' style={{ justifyContent: 'space-around' }}>
                                <div className='row dashLeftBottomLabelContainer'>
                                    <p className='dashLeftCardLLabel'>registered devices: </p>
                                    <button className='dashLeftCardRLabel' onClick={this.addDeviceMode}>
                                        <img className='dashPlusIcon' src={plus} alt='btn' />
                                    </button>
                                </div>
                                <div className='col dashDeviceList'>

                                </div>
                            </div>
                        </div>
                        <div className='col dashCard dashRightCard' style={{ justifyContent: 'space-around' }}>
                            <p className='dashRightLabel'>Past Backup Reports</p>
                            <div className='col dashReportList'>

                            </div>
                        </div>
                    </div>
                    <div className='col dashIndicator'>
                        <div className='dashIndicatorBar'>
                            <Line percent='100' strokeWidth='1' strokeColor='#e6b329' />
                        </div>
                    </div>
                </div>
                <div className='col dashDetail'>
                    {this.state.detailMode === 'dev' &&
                        <div className='col dashAddDeviceContainer'>
                            <div style={{ width: '30ch' }}>
                                <button className='fileNavBtn' onClick={this.cancelDetail}>
                                    <img className='fileNavImg' src={chevL} />
                                </button>
                            </div>
                            <div style={{ height: '14vh' }} />
                            <img src={pc} alt='pc' />
                            <div style={{ height: '4vh' }} />
                            <p className='noselect loginInputLabel'>Device Name</p>
                            <div className='loginInputBox'>
                                <img className='loginIcons' src={pc} alt='logo' />
                                <input className='loginInput' type='text' placeholder='New Device Name' onChange={this.handleDeviceName} />
                            </div>
                            <p className='noselect loginInputLabel'>Root Directory</p>
                            <div className='loginInputBox'>
                                <img className='loginIcons' src={fileE} alt='logo' />
                                <input className='loginInput' type='text' placeholder='Device Root Directory' onChange={this.handelDeviceRootDir} />
                            </div>
                            <div style={{ height: '7vh' }} />
                            <button className='loginBtns loginBtn' onClick={this.addDevice}>
                                <p>add</p>
                            </button>
                        </div>
                    }
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