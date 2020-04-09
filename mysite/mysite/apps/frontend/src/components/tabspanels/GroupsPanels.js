import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


export class GroupsPanels extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        // console.log('didupdate', this.accordionAll.children[0].clientHeight);
    }

    render() {
        const { } = this.state;
        const { annotations } = this.props;
        return (
            <div className="container pt-0" style={{ background: 'antiquewhite' }}>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: '45vh',
                        minHeight: '45vh', // allHeightStr,
                    }}
                >
                    aaa
                </div>
                <div
                    className="row"
                    style={{
                        background: 'darkgoldenrod',
                        overflowY: 'scroll',
                        maxHeight: '45vh',
                        minHeight: '45vh', // allHeightStr,
                    }}
                >
                    <div className="col" style={{ padding: '2px', background: 'antiquewhite' }}>
                        bbb
                    </div>
                    <div className="col" style={{ padding: '2px', background: 'darkseagreen' }}>
                        ccc
                    </div>
                </div>
            </div>
        );
    }
}

GroupsPanels.propTypes = {
    annotations: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => ({
    annotations: state.annotations.annotations,
});

export default connect(mapStateToProps, {})(GroupsPanels);
