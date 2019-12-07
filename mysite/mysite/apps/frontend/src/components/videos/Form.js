import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { addVideo } from '../../actions/videos';
import { MyTree } from './Tree';
// import { getProjects, getProjectPacks } from '../../actions/projects';


export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            checkedFolders: [],
            folderMode: false,
        };
    }

    componentDidMount() {
        console.log('componentDidMount in video form');
        // this.props.getProjects();
    }

    componentDidUpdate() {
        console.log('componentDidUpdate in video form');
        console.log(this.state);
    }

    callbackFunction = (childData) => {
        this.setState({ checkedFolders: childData });
        console.log('childData', childData);
    }

    onChange = (e) => { this.setState({ [e.target.name]: e.target.value }); }

    onCheck = (e) => { this.setState({ [e.target.name]: e.target.checked }); }

    onSubmit = (e) => {
        e.preventDefault();
        console.log('submit add video');
        console.log(this.state);

        const { checkedFolders, folderMode } = this.state;
        const { addVideo } = this.props;
        const video = { checkedFolders, folderMode };
        addVideo(video);
    }

    render() {
        const { folderMode } = this.state;
        const { show, parentCallHide } = this.props;
        console.log('render in video form');
        return (
            <>
                <Modal show={show} onHide={parentCallHide} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Video And Create Task </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.onSubmit}>
                            <div className="container">
                                <div className="row p-3">
                                    <div className="col-auto mr-auto p-0">
                                        <label htmlFor="uploadMode">Create one task by one folder</label>
                                        <input
                                            id="uploadMode"
                                            type="checkbox"
                                            name="folderMode"
                                            value={folderMode}
                                            onChange={this.onCheck}
                                        />
                                    </div>
                                    <div className="col-auto p-0">
                                        <button type="submit" className="btn btn-primary">Create</button>
                                    </div>
                                    <div className="col p-0">
                                        <MyTree parentCallback={this.callbackFunction} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

Form.propTypes = {
    // projects: PropTypes.array.isRequired,
    // packs: PropTypes.array.isRequired,
    // getProjects: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    parentCallHide: PropTypes.func.isRequired,
    addVideo: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//     // state.reducer.initialState's content
//     // packs: state.projects.project_packs,
//     // projects: state.projects.projects

// });

export default connect(null, { addVideo })(Form);
