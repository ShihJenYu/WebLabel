import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addVideo } from '../../actions/videos';
import { MyTree } from './Tree';
// import { getProjects, getProjectPacks } from '../../actions/projects';


export class Form extends Component {

    state = {
        name: '',
        checkedFolders: [],
        folderMode: false
        // pack: null
    }
    
    callbackFunction = (childData) => {
        this.setState({ checkedFolders: childData })
        console.log('childData', childData);
    }

    static propTypes = {
        // projects: PropTypes.array.isRequired,
        // packs: PropTypes.array.isRequired,
        // getProjects: PropTypes.func.isRequired,
        // getProjectPacks: PropTypes.func.isRequired,
        addVideo: PropTypes.func.isRequired,
    }

    componentDidMount() {
        console.log("componentDidMount in video form");
        //this.props.getProjects();
    }

    componentDidUpdate() {
        console.log("componentDidUpdate in video form");
        console.log(this.state)
    }

    onChange = e => { this.setState({ [e.target.name]: e.target.value }); }
    onCheck = e => { this.setState({ [e.target.name]: e.target.checked }); }

    resetPacks = e => {
        this.props.getProjectPacks(e.target.value);
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("submit add video");
        console.log(this.state)

        const { checkedFolders, folderMode } = this.state;
        const video = { checkedFolders, folderMode };
        this.props.addVideo(video);
    }

    render() {
        const { name, folderMode } = this.state;
        console.log("render in video form");
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="videoname">Video Name</label>
                        <input type="text" className="form-control" id="videoname" aria-describedby="videonameHelp" placeholder="Enter new video name"
                            name="name"
                            value={name}
                            onChange={this.onChange} />
                        <small id="videonameHelp" className="form-text text-muted">the video will collect tasks for one worker</small>
                        <label htmlFor="uploadMode">uploadMode: isFolder</label>
                        <input id="uploadMode" type="checkbox"
                            name="folderMode"
                            value={folderMode}
                            onChange={this.onCheck}
                        />
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                    </div>

                    <MyTree parentCallback={this.callbackFunction} />


                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    // state.reducer.initialState's content
    // packs: state.projects.project_packs,
    // projects: state.projects.projects

})

export default connect(mapStateToProps, { addVideo })(Form);
