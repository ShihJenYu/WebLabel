import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'font-awesome/css/font-awesome.min.css';

export class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            project_id: null,
            project_name: null,
            selected: [],
            project_users: { in: [], all: [] },
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('getDerivedStateFromProps', nextProps, prevState);
        if (nextProps.project_id !== prevState.project_id) {
            return {
                show: nextProps.show,
                project_id: nextProps.project_id,
                project_name: nextProps.project_name,
                selected: nextProps.project_users.in.sort(),
                project_users: nextProps.project_users,
            };
        }
        return null;
    }

    componentDidMount() {
        console.log('componentDidMount in project editor');

        console.log(this.state);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in project editor');
        console.log(this.state);
    }

    onChange = (selected) => {
        this.setState({ selected });
    };

    // async (pack) => {
    //     const { onAddPack } = this.props;
    //     const res = await axios.post('/api/v1/packs/', pack);
    //     console.log('res.data', res.data);

    //     onAddPack(res.data);
    // }

    onSave = async () => {
        const { selected, project_id } = this.state;
        const res = await axios.post(`/api/v1/projects/${project_id}/users/`, { selected });
        console.log('in save,', res);
    };

    onReset = () => {
        const { project_users } = this.state;
        this.setState({ selected: project_users.in });
    };

    render() {
        const {
            show, selected, project_name, project_users,
        } = this.state;
        const { parentCallHide } = this.props;

        const tmp = [...project_users.all].sort();
        const options = tmp.map((item) => ({ value: item, label: item }));
        console.log('options', options);

        let content = '';
        if (show) {
            content = (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2>{project_name}</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="mr-auto">Available</div>
                        <div className="mr-auto">Chosen</div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <DualListBox
                                canFilter
                                options={options}
                                selected={selected}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>


                    <div className="row mt-2">
                        <div className="col">
                            <button onClick={this.onSave} className="btn btn-block btn-secondary">
                            Save
                            </button>
                        </div>
                        <div className="col">
                            <button onClick={this.onReset} className="btn btn-block btn-secondary">
                            Reset
                            </button>
                        </div>
                        <div className="col">
                            <button onClick={parentCallHide} className="btn btn-block btn-secondary">
                            Close
                            </button>
                        </div>
                    </div>

                </div>
            );
        }
        return (
            <>
                {content}
            </>
        );
    }
}

Editor.propTypes = {
    show: PropTypes.bool.isRequired,
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_users: PropTypes.shape({
        in: PropTypes.array,
        all: PropTypes.array,
    }).isRequired,
    parentCallHide: PropTypes.func.isRequired,
};

export default connect(null, { })(Editor);
