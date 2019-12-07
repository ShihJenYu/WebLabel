import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';


export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = { file: null };
    }

    componentDidMount() {

    }

    onChange = (event) => {
        this.setState({ file: event.target.files[0] });
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log('upload file');
        console.log(this.state);
        const { file } = this.state;


        const data = new FormData();
        data.append('file', file);
        data.append('action', 'assign_tasks');

        axios.post(`${window.location.origin}/api/v1/server/upload/`, data)
            .then((res) => { // then print response status
                console.log(res.statusText);
            });
    }


    render() {
        const { file } = this.state;
        const filename = (file == null) ? 'Choose a file' : file.name;
        return (
            <form onSubmit={this.onSubmit}>

                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupFileAddon01">
                                Select Json File
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
                    <button type="submit" className="btn btn-primary">Upload</button>
                </div>
            </form>
        );
    }
}


export default connect(null, {})(Uploader);
