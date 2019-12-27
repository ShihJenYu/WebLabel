import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
            project_users: { in: [], out: [] },
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
            // this.getUsers(nextProps);
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


    // onChange = (e) => {
    //     this.setState({ [e.target.name]: e.target.value });
    //     console.log(this.state);
    // }

    onChange = (selected) => {
        this.setState({ selected });
    };

    handleShow = () => { this.setState({ show: true }); }

    render() {
        const { selected, project_name, project_users } = this.state;
        const { show } = this.props;
        // const options = [
        //     { value: 'one', label: 'Option One' },
        //     { value: 'two', label: 'Option Two' },
        //     { value: project_name, label: project_name },
        // ];

        const tmp = [...project_users.in, ...project_users.out].sort();
        console.log('tmp', tmp);
        const options = tmp.map((item) => ({ value: item, label: item }));
        console.log('options', options);

        let content = '';
        if (show) {
            content = (
                <DualListBox
                    canFilter
                    options={options}
                    selected={selected}
                    onChange={this.onChange}

                />
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
        out: PropTypes.array,
    }).isRequired,
};

export default connect(null, { })(Editor);
