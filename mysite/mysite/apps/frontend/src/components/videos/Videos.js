import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getVideos, deleteVideo } from '../../actions/videos';

export class Videos extends Component {

    static propTypes = {
        videos: PropTypes.array.isRequired,
        getVideos: PropTypes.func.isRequired,
        deleteVideo: PropTypes.func.isRequired
    }

    componentDidMount() {
        console.log("componentDidMount in video videos");
        this.props.getVideos();
    }

    render() {
        console.log("render in video videos");
        return (
            <Fragment>
                <h2>Videos</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Folder</th>
                            <th>Path</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.videos.map(video => (
                            <tr key={video.id}>
                                <td>{video.id}</td>
                                <td>{video.folder}</td>
                                <td>{video.path}</td>
                                <td>
                                    <button onClick={this.props.deleteVideo.bind(this, video.id)} className="btn btn-danger btn-sm">
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
    videos: state.videos.videos

})

export default connect(mapStateToProps, { getVideos, deleteVideo })(Videos);
