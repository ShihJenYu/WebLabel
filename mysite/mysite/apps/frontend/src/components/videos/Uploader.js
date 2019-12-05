import React, { Component } from 'react';
import ReactDOM from 'react-dom'; import { connect } from 'react-redux';
import axios from 'axios';


export class Uploader extends Component {

    // sendData = () => {
    //     this.props.parentCallback(this.state.checkedKeys);
    // }

    state = {
        file: null
    };



    componentDidMount() {

    }

    onChange = e => {
        this.setState({ file: event.target.files[0] })
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("upload file");
        console.log(this.state)


        const data = new FormData()
        data.append('file', this.state.file);
        data.append('action', 'assign_tasks')

        axios.post(`${window.location.origin}/api/v1/server/upload/`, data)
            .then(res => { // then print response status
                console.log(res.statusText)
            })
    }


    render() {
        const { file } = this.state;
        let filename = (file == null) ? 'Choose a file' : file.name
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroupFileAddon01">
                                Upload
                            </span>
                        </div>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                aria-describedby="inputGroupFileAddon01"
                                onChange={this.onChange}
                            />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">
                                {filename}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Upload</button>
                </div>
            </form>

        );
    }
}


export default connect(null, {})(Uploader);