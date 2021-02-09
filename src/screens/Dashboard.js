import React from 'react';

import { connect } from 'react-redux';

import './css/dashboard.css';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.acc)
    }

    render() {
        return (
            <div className='row dashRoot'>
                <div className='dashContent'>
                    <div className='row dashTopbar'>
                        <div className='row dashCard dashTopLeftCard'>
                            <div className='col'>
                                <p>Start Full System Sync</p>
                                <p>Status: </p>
                            </div>
                            <p>Start Full System Sync</p>
                        </div>
                        <div className='dashCard dashTopRightCard'>
                            <p className='timeSinceText'>time since last back up: 00:00:00:00</p>
                        </div>
                    </div>
                    <div className='row dashMain'>
                        <div className='col dashMainLeft'>
                            <div className='dashCard dashLeftCard'>
                                <p className='timeSinceText'>time since last back up: 00:00:00:00</p>
                            </div>
                            <div className='dashCard dashLeftCard'>
                                <p className='timeSinceText'>time since last back up: 00:00:00:00</p>
                            </div>
                            <div className='dashCard dashLeftCard'>

                            </div>
                            <div className='dashCard dashReportCard'>

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
});

export default connect(mapStateToProps)(Dashboard);