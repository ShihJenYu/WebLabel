import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBatchs, deleteBatch } from '../../actions/batchs';

export class Batchs extends Component {

    static propTypes = {
        batchs: PropTypes.array.isRequired,
        getBatchs: PropTypes.func.isRequired,
        deleteBatch: PropTypes.func.isRequired
    }

    componentDidMount() {
        console.log("componentDidMount in batch batchs");
        this.props.getBatchs();
    }

    render() {
        console.log("render in batch batchs");
        return (
            <Fragment>
                <h2>Batchs</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.batchs.map(batch => (
                            <tr key={batch.id}>
                                <td>{batch.id}</td>
                                <td>{batch.name}</td>
                                <td>
                                    <button onClick={this.props.deleteBatch.bind(this, batch.id)} className="btn btn-danger btn-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    batchs: state.batchs.batchs

})

export default connect(mapStateToProps, { getBatchs, deleteBatch })(Batchs);
