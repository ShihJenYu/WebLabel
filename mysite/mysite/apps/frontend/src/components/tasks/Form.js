import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTask } from '../../actions/tasks';

export class Form extends Component {

    state = {
        name: '',
    }

    static propTypes = {
        addTask: PropTypes.func.isRequired,
    }

    onChange = e => { this.setState({ [e.target.name]: e.target.value }); console.log(this.state) }

    onSubmit = e => {
        e.preventDefault();
        console.log("submit add task");
        console.log(this.state)
        const { name } = this.state;
        const task = { name };
        this.props.addTask(task);
    }

    render() {
        const { name } = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="taskname">Task Name</label>
                        <input type="text" className="form-control" id="taskname" aria-describedby="tasknameHelp" placeholder="Enter new project name"
                            name="name"
                            value={name}
                            onChange={this.onChange} />
                        <small id="tasknameHelp" className="form-text text-muted">Dont create existed project</small>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(null, { addTask })(Form);
