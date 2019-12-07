import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProjects } from '../../actions/projects';

export class PackSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { current_pack: null };
    }

    componentDidMount() {
        // const { getProjects } = this.props;
        // getProjects();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { project } = this.props;
        console.log('nextProps.current_project.id', nextProps);
        if (nextProps.project !== project) {
            this.setState({ current_pack: null });
        }
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in MySelect');
        console.log(this.state);
    }

    sendData = () => {
        // getProjectPacks ,
        const { onPackChange } = this.props;
        const { current_pack } = this.state;
        console.log('sendData', current_pack);
        onPackChange(current_pack);
    }

    onChange = (e) => {
        this.setState({
            current_pack: {
                id: e.target.value,
                name: e.target.selectedOptions[0].text,
            },
        },
        () => { this.sendData(); });
    }

    render() {
        const { current_pack } = this.state;
        const { project_packs } = this.props;
        console.log('in render', current_pack);
        const selected_value = (current_pack === null) ? 'DEFAULT' : current_pack.id;
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                            Pack:
                    </span>
                </div>
                <select className="form-control" id="packSelect" name="pack" onChange={this.onChange} value={selected_value}>
                    <option disabled value="DEFAULT"> -- select an option -- </option>
                    {project_packs.map((pack) => (
                        <option key={pack.id} value={pack.id}>{pack.name}</option>
                    ))}
                </select>
            </div>
        );
    }
}

PackSelect.propTypes = {
    project_packs: PropTypes.arrayOf(PropTypes.any).isRequired,
    project: PropTypes.string.isRequired,
    onPackChange: PropTypes.func.isRequired,
    // parentCallback: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    // state.reducer.initialState's content
    project_packs: state.projects.project_packs,
});

export default connect(mapStateToProps, { getProjects })(PackSelect);
