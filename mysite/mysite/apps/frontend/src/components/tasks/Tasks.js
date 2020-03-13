import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTasks, deleteTask } from '../../actions/tasks';

import MaterialTable, { MTableToolbar } from 'material-table';
import Chip from '@material-ui/core/Chip';

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
import Refresh from '@material-ui/icons/Refresh';

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
    Refresh: forwardRef((props, ref) => <Refresh {...props} ref={ref} />),
    PlaylistAddCheckIcon: forwardRef((props, ref) => <Refresh {...props} ref={ref} />),
};

export class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const { tasks, refreshTasks } = this.props;

        const m_columns = [
            { title: 'Batch', field: 'batch_name' },
            { title: 'Name', field: 'name' },
            { title: 'Path', field: 'path' },
        ];
        const m_options = {
            filtering: true,
            selection: true,
            paging: true,
            pageSizeOptions: [10, 20, 25, 50],
            pageSize: 10,
            maxBodyHeight: 600,
        };

        return (
            <>
                <MaterialTable
                    icons={tableIcons}
                    title="Tasks"
                    columns={m_columns}
                    data={tasks}
                    options={m_options}
                    editable={{
                        // onRowDelete: (oldData) => new Promise((resolve) => {
                        //     setTimeout(() => {
                        //         this.delete_video(oldData.id);
                        //         resolve();
                        //     }, 100);
                        // }),
                    }}
                    actions={[
                        {
                            icon: Refresh,
                            tooltip: 'Refresh Data',
                            isFreeAction: true,
                            onClick: () => { refreshTasks(); },
                        },
                        // {
                        //     icon: PlaylistAddCheckIcon,
                        //     tooltip: 'create task',
                        //     onClick: (evt, data) => { alert(`You selected ${data.length} rows`); },
                        // },
                    ]}
                    components={{
                        Toolbar: (props) => (
                            <div>
                                <MTableToolbar {...props} />
                                <div style={{ padding: '0px 10px' }}>
                                    {/* <Chip
                                        label="create task (video)"
                                        color="secondary"
                                        style={{ marginRight: 5, fontSize: 18 }}
                                        onClick={() => {
                                            console.log(`create task (video) ${props.selectedRows.length} rows`);
                                            // this.create_tasks('video', props.selectedRows);
                                        }}
                                    />
                                    <Chip
                                        label="create task (frame)"
                                        color="secondary"
                                        style={{ marginRight: 5, fontSize: 18 }}
                                        onClick={() => {
                                            console.log(`create task (frame) ${props.selectedRows.length} rows`);
                                            // this.create_tasks('frame', props.selectedRows);
                                        }}
                                    /> */}
                                </div>
                            </div>
                        ),
                    }}
                />
            </>
        );
    }
}

Tasks.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    // getTasks: PropTypes.func.isRequired,
    // deleteTask: PropTypes.func.isRequired,
    refreshTasks: PropTypes.func.isRequired,
};

export default connect(null, {})(Tasks);
