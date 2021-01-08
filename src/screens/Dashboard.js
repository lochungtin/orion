import React from 'react';

import { connect } from 'react-redux';

class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <p>dashboard</p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account,
});

export default connect(mapStateToProps)(Dashboard);