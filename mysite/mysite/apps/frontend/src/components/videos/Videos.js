import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import MaterialTable from 'material-table';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export class Videos extends Component {
    componentDidMount() {
        console.log('componentDidMount in video videos');
        // const { getVideos } = this.props;
        // getVideos();
    }

    async delete_video(id) {
        const { onDeleteVideo } = this.props;
        // await deleteVideo(id);
        const res = await axios.delete(`/api/v1/videos/${id}/`);
        console.log('res.data', res.data);
        onDeleteVideo(id);
    }

    render() {
        console.log('render in video videos');
        const { videos } = this.props;

        const m_columns = [
            { title: 'ID', field: 'id' },
            { title: 'Folder', field: 'folder' },
        ];

        const m_options = {
            filtering: true,
            pageSizeOptions: [10, 20],
            pageSize: 10,
        };

        return (
            <>
                <MaterialTable
                    icons={tableIcons}
                    title="Videos"
                    columns={m_columns}
                    data={videos}
                    options={m_options}
                    editable={{
                        onRowDelete: (oldData) => new Promise((resolve) => {
                            setTimeout(() => {
                                this.delete_video(oldData.id);
                                resolve();
                            }, 100);
                        }),
                    }}
                />
            </>
        );
    }
}

Videos.propTypes = {
    videos: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDeleteVideo: PropTypes.func.isRequired,
};

// const mapStateToProps = (state) => ({
//     videos: state.videos.videos,

// });

export default connect(null, { })(Videos);
