import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

export class PackSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { currentPack: { id: null, name: null } };
    }

    componentDidMount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { projectPacks } = this.props;
        console.log('nextProps.current_project.id', nextProps);
        if (nextProps.projectPacks !== projectPacks) {
            this.setState({ currentPack: { id: null, name: null } });
        }
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in MySelect');
        console.log(this.state);
    }

    sendData = () => {
        const { onPackChange } = this.props;
        const { currentPack } = this.state;
        console.log('sendData', currentPack);
        onPackChange(currentPack);
    }

    onChange = (e) => {
        this.setState({
            currentPack: {
                id: +e.target.value,
                name: e.target.selectedOptions[0].text,
            },
        }, () => { this.sendData(); });
    }

    resetSelected = () => {
        const { onPackChange } = this.props;
        this.setState({ currentPack: { id: null, name: null } });
        onPackChange({ id: null, name: null });
    }

    render() {
        const { currentPack } = this.state;
        const { projectPacks } = this.props;
        console.log('in render', currentPack);
        const currentPID = (currentPack.id === null) ? -1 : currentPack.id;
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Pack:
                    </span>
                </div>
                <select className="form-control" id="packSelect" name="pack" onChange={this.onChange} value={currentPID}>
                    <option disabled value="-1"> -- select an option -- </option>
                    {projectPacks.map((pack) => (
                        <option key={pack.id} value={pack.id}>{pack.name}</option>
                    ))}
                </select>
                <div className="input-group-append">
                    <span className="input-group-text">
                        <IconButton
                            aria-label="reset"
                            size="medium"
                            style={{ margin: 0, padding: 0 }}
                            onClick={this.resetSelected}
                        >
                            <RefreshIcon fontSize="default" />
                        </IconButton>
                    </span>
                </div>
            </div>
        );
    }
}

PackSelect.propTypes = {
    projectPacks: PropTypes.arrayOf(PropTypes.object).isRequired,
    onPackChange: PropTypes.func.isRequired,
};

export default connect(null, {})(PackSelect);
