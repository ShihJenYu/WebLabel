import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';

import { IconButton } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Badge from 'react-bootstrap/Badge';

export class GroupCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {

    }

    handleButtonClick = (e) => {
        e.stopPropagation();
        console.log('click');
    }

    handleButtonClick2 = (e) => {
        e.stopPropagation();
        console.log('click2');
    }

    handleButtonClick3 = (e) => {
        const { hidden } = this.state;
        e.stopPropagation();
        console.log('click3');
        this.setState({ hidden: !hidden });
    }

    handleButtonClick4 = (e) => {
        e.stopPropagation();
        console.log('click4');
    }

    handleButtonClick5 = (e, object) => {
        const { onObjectSelect } = this.props;
        e.stopPropagation();
        console.log('click5');
        onObjectSelect(object.id);
    }


    render() {
        const { hidden } = this.state;
        const { labelname, objects, onObjectEnter, onObjectLeave, hoverObject } = this.props;

        let content = '';
        if (!hidden) {
            content = objects.map((object) => (
                // <Badge variant="primary">{object.id}</Badge>
                <button
                    style={{
                        margin: '0px 2px',
                        boxShadow: (hoverObject && hoverObject.id === object.id)
                            ? '0px 0px 5px 0px' : '0px 0px 0px 0px',
                    }}
                    onClick={(e) => {
                        this.handleButtonClick5(e, object);
                    }}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        onObjectEnter(object);
                    }}
                    onMouseLeave={(e) => {
                        e.stopPropagation();
                        onObjectLeave(object);
                    }}
                >
                    {object.id}
                </button>
            ));
        }

        return (
            <div
                className="card"
                style={{ marginBottom: '1px' }}
                onClick={(e) => {
                    this.handleButtonClick(e);
                }}
            >
                <div
                    className="card-header p-0"
                    onClick={(e) => {
                        this.handleButtonClick2(e);
                    }}
                >
                    {labelname}
                    <IconButton
                        className="float-right p-0"
                        aria-label="delete"
                        onClick={(e) => {
                            this.handleButtonClick3(e);
                        }}
                    >
                        {hidden ? <AddIcon /> : <RemoveIcon />}
                    </IconButton>
                </div>
                <div
                    className="card-body p-1"
                    style={{ display: 'flex', overflowY: 'auto' }}
                    onClick={(e) => {
                        this.handleButtonClick4(e);
                    }}
                >
                    {content}
                </div>
            </div>
        );
    }
}

GroupCards.propTypes = {
    // annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
    objects: PropTypes.arrayOf(PropTypes.any).isRequired,
    hoverObject: PropTypes.any.isRequired,
    labelname: PropTypes.string.isRequired,
    onObjectSelect: PropTypes.func.isRequired,
    onObjectEnter: PropTypes.func.isRequired,
    onObjectLeave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    // annotations: state.annotations.annotations,
});

export default connect(mapStateToProps, {})(GroupCards);
