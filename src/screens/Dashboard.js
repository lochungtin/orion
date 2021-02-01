import React from 'react';

import { connect } from 'react-redux';

import './css/dashboard.css';

class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <div className='dashTopbar'>
                    <div className='dashCard dashTopLeftCard'>

                    </div>
                    <div className='dashCard dashTopRightCard'>

                    </div>
                </div>
                <div className='dashMain'>
                    <div className='dashMainLeft'>
                        <div className='dashCard dashLeftCard'>

                        </div>
                        <div className='dashCard dashLeftCard'>

                        </div>
                        <div className='dashCard dashLeftCard'>

                        </div>
                        <div className='dashCard dashReportCard'>

                        </div>
                    </div>
                    <div className='dashCard dashRightCard'>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account,
});

export default connect(mapStateToProps)(Dashboard);