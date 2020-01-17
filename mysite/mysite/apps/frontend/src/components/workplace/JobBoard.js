import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import axios from 'axios';

export class JobBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batch: null,
            tasks: [],
        };
    }

    componentDidMount() {
        console.log('Job componentDidMount');
        this.get_batch();
    }

    onAsk = () => {
        console.log('onAsk');
        this.ask_batch();
    };

    onSend = () => {
        console.log('onSend');
        this.send_batch();
    };

    async get_batch() {
        // await deletePack(id);
        const { project } = this.props;

        const res = await axios.get(`/api/v1/projects/${project.id}/batch/`);
        console.log('res.data', res.data);

        this.setState({
            batch: res.data.batch,
            tasks: res.data.tasks,
        });
    }

    async ask_batch() {
        // await deletePack(id);
        const { project } = this.props;

        const res = await axios.post(`/api/v1/projects/${project.id}/batch/`);
        console.log('res.data', res.data);

        this.setState({
            batch: res.data.batch,
            tasks: res.data.tasks,
        });
    }

    async send_batch() {
        const { batch } = this.state;
        const res = await axios.post(`/api/v1/batchs/${batch.id}/send/`);
        console.log('res.data', res.data);
        this.setState({ batch: null, tasks: [] });
    }

    render() {
        const { batch, tasks } = this.state;
        let tb = '';
        let batchName = '';
        if (batch) {
            batchName = batch.name;
        }
        if (tasks.length > 0) {
            tb = tasks.map((task) => (
                <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.name}</td>
                    <td><a href={`/annotation?id=${task.id}`} rel="noopener noreferrer" target="_blank">Click Me</a></td>
                </tr>
            ));
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Job Board</h1>
                    </div>
                </div>
                <div className="row justify-content-start">
                    <div className="col-3">
                        <Button block variant="outline-info" onClick={this.onAsk}>Ask</Button>
                    </div>
                    <div className="col-3">
                        <Button block variant="outline-info" onClick={this.onSend}>Send</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>{`Batch Name: ${batchName}`}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {/* <h2>tasks table</h2> */}
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tb}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        );
    }
}


JobBoard.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default connect(null, {})(JobBoard);
