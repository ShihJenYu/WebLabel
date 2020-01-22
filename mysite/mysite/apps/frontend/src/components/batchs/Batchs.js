import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

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
import OpenInNewIcon from '@material-ui/icons/OpenInNew';


import PackSelect from '../myselect/PackSelect';
import ProjectSelect from '../myselect/ProjectSelect';

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
    OpenInNewIcon: forwardRef((props, ref) => <OpenInNewIcon {...props} ref={ref} />),
};

export class Batchs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProject: { id: null, name: null },
            currentPack: { id: null, name: null },
            projectPacks: [],
            batchs: [],
            newBatch: { id: null, name: null, pack: null },
            tasks: [],
            currentPackName: '',
            currentBatchName: '',
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.newBatch.id !== nextProps.newBatch.id) {
            if (prevState.currentPack.id === nextProps.newBatch.pack) {
                return {
                    newBatch: nextProps.newBatch,
                    batchs: [...prevState.batchs, nextProps.newBatch],
                    currentPack: prevState.currentPack,
                    currentProject: prevState.currentProject,
                };
            }
        }
        return null;
    }

    componentDidMount() {
        console.log('componentDidMount in batch batchs');
        // this.props.getBatchs();
    }


    async getBatchs(pack) {
        const res = await axios.get(`/api/v1/batchs/?pack=${pack.id}`);
        this.setState({
            batchs: res.data,
            tasks: [],
            currentPackName: pack.name,
            currentBatchName: '',
        });
        console.log('ToDo write api for get batchs  use pack id');
    }


    async getTasks(id, name) {
        const res = await axios.get(`/api/v1/tasks/?batch=${id}`);
        console.log('res.data', res.data);
        this.setState({ tasks: res.data, currentBatchName: name });
    }


    handleProjectChange = (project, packs) => {
        console.log('selectProject, projectPacks', project, packs);
        const { currentProject, projectPacks, currentPack } = this.state;
        this.setState(
            {
                currentProject: project,
                projectPacks: packs,
                currentPack: { id: null, name: null },
            },
            () => {
                console.log('handleProjectChange set', currentProject, projectPacks, currentPack);
            },
        );
    }

    handlePackChange = (childData) => {
        const { currentPack } = this.state;
        this.setState({ currentPack: childData }, () => { console.log('handlePackChange set', childData, currentPack); });
    }


    handleSearch = () => {
        const { currentProject, currentPack } = this.state;
        console.log('handleSearch', currentProject, currentPack);

        if (typeof (currentProject.id) === 'number' && typeof (currentPack.id) === 'number') {
            this.getBatchs(currentPack);
        }
    }

    async delete_batch(id) {
        const { batchs } = this.state;
        const res = await axios.delete(`/api/v1/batchs/${id}/`);
        console.log('res.data', res.data);
        this.setState({ batchs: batchs.filter((item) => item.id !== id) },
            () => {
                console.log('batchs', batchs);
            });
    }


    render() {
        console.log('render in batch batchs');
        const {
            batchs, projectPacks, currentProject, currentPack, tasks,
            currentBatchName, currentPackName,
        } = this.state;

        let flag = true;
        if (typeof (currentProject.id) === 'number' && typeof (currentPack.id) === 'number') {
            flag = false;
        }

        const tasksTitle = `${currentBatchName} Tasks`;
        const batchsTitle = `${currentPackName} Batchs`;

        const m_columns = [
            { title: 'ID', field: 'id' },
            { title: 'Name', field: 'name' },
            { title: ' TasksDetail' },
        ];

        const m_options = {
            filtering: true,
            // selection: true,
            pageSizeOptions: [10, 20],
            pageSize: 10,
        };

        return (
            <div className="container-fluid">
                <div className="row p-3">
                    <div className="col p-0">
                        <ProjectSelect onProjectChange={this.handleProjectChange} />
                    </div>
                    <div className="col p-0">
                        <PackSelect
                            projectPacks={projectPacks}
                            onPackChange={this.handlePackChange}
                        />
                    </div>
                    <div className="col p-0">
                        <Button variant="primary" onClick={this.handleSearch} disabled={flag}>
                            Search
                            {/* #TODO: create api get project's pack's videos */}
                        </Button>
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-7 p-2">
                        <MaterialTable
                            icons={tableIcons}
                            title={batchsTitle}
                            columns={m_columns}
                            data={batchs}
                            options={m_options}
                            editable={{
                                onRowDelete: (oldData) => new Promise((resolve) => {
                                    setTimeout(() => {
                                        this.delete_batch(oldData.id);
                                        resolve();
                                    }, 100);
                                }),
                            }}
                            actions={[
                                {
                                    // TOTO:  hahaha
                                    tooltip: 'show selected batch der tasks',
                                    icon: OpenInNewIcon,
                                    onClick: (evt, data) => {
                                        // if (data.length !== 1) {
                                        //     alert(`You select ${data.length} rows`);
                                        // } else {
                                        // }
                                        this.getTasks(data.id, data.name);
                                    },
                                },
                            ]}
                        />
                    </div>
                    <div className="col-5 p-2">
                        <MaterialTable
                            icons={tableIcons}
                            title={tasksTitle}
                            columns={m_columns}
                            data={tasks}
                            options={m_options}
                            editable={{
                                onRowDelete: (oldData) => new Promise((resolve) => {
                                    setTimeout(() => {
                                        this.delete_batch(oldData.id);
                                        resolve();
                                    }, 100);
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Batchs.propTypes = {
    newBatch: PropTypes.shape({
        id: PropTypes.number,
        pack: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
    // getBatchs: PropTypes.func.isRequired,
    // deleteBatch: PropTypes.func.isRequired,
};

export default connect(null, {})(Batchs);
