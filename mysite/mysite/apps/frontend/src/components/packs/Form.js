import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            officepriority: 0,
            sohopriority: 0,
        };
    }

    componentDidMount() {
        // this.props.getProjects();
    }

    addPack = async (pack) => {
        const { onAddPack } = this.props;
        const res = await axios.post('/api/v1/packs/', pack);
        console.log('res.data', res.data);

        onAddPack(res.data);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.name, e.target.value, this.state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log('submit add pack');
        console.log(this.state, 'ss', this.props);
        const { name, officepriority, sohopriority } = this.state;
        const { projectID } = this.props;
        if (projectID !== -1) {
            const pack = {
                name, officepriority, sohopriority, project: projectID,
            };
            this.addPack(pack);
        } else {
            console.log('project id is -1,  create was pass');
        }
    }

    render() {
        const { name, officepriority, sohopriority } = this.state;
        const { show, parentCallHide } = this.props;
        console.log('data', show);
        return (
            <div>
                <Modal show={show} onHide={parentCallHide} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Pack Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.onSubmit}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-9">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="packname"
                                                aria-describedby="packnameHelp"
                                                placeholder="Enter new pack name"
                                                name="name"
                                                value={name}
                                                onChange={this.onChange}
                                            />
                                            <small id="packnameHelp" className="form-text text-muted">Dont create existed pack in project</small>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary">Create</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">office</span>
                                            </div>
                                            <input className="form-control" type="number" value={officepriority} name="officepriority" onChange={this.onChange} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">soho</span>
                                            </div>
                                            <input className="form-control" type="number" value={sohopriority} name="sohopriority" onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

Form.propTypes = {
    projectID: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    parentCallHide: PropTypes.func.isRequired,
    onAddPack: PropTypes.func.isRequired,
};

export default connect(null, { })(Form);
