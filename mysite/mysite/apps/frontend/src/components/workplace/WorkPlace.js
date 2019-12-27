import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


export class WorkPlace extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { project } = this.props;

        return (
            <>
                <h2>{project}</h2>
            </>
        );
    }
}

WorkPlace.propTypes = {
    project: PropTypes.string.isRequired,
};

export default connect(null, {})(WorkPlace);
