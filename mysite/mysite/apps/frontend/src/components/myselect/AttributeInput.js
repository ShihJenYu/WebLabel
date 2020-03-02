import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';


const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        minWidth: 140,
        maxWidth: 140,
        padding: '1px 5px 2px 5px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            // boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

export class AttributeInput extends Component {
    constructor(props) {
        super(props);
        this.state = { tipOpen: false };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    handleEnter = (e) => {
        console.log('handleOpen2', e.target.value);
        this.setState({
            tipOpen: true,
        });
    }

    handleLeave = (e) => {
        console.log('handleOpen', e.target.value);
        this.setState({
            tipOpen: false,
        });
    }

    handleChange = (e) => {
        const { onChange } = this.props;
        onChange(e);
    }

    render() {
        const { tipOpen } = this.state;
        const { params, value } = this.props;

        return (
            <div style={{ height: '24px' }}>
                <Tooltip title={value} arrow open={tipOpen}>
                    <BootstrapInput
                        inputProps={params}
                        onMouseEnter={this.handleEnter}
                        onMouseLeave={this.handleLeave}
                        onChange={this.handleChange}
                        name="value"
                        value={value}
                    />
                </Tooltip>
            </div>
        );
    }
}

AttributeInput.defaultProps = {
    params: {},
    onChange: () => { },
    value: '',
};

AttributeInput.propTypes = {
    params: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.any,
};

export default connect(null, {})(AttributeInput);
