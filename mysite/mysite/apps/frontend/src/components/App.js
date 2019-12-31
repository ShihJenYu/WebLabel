import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import Header from './layout/Header';
import TaskDashboard from './tasks/Dashboard';
import ProjectDashboard from './projects/Dashboard';
import PackDashboard from './packs/Dashboard';
import BatchDashboard from './batchs/Dashboard';
import VideoDashboard from './videos/Dashboard';
import WorkPlace from './workplace/WorkPlace';
import Login from './login/Login';
import Logout from './login/Logout';


import store from '../store';

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = { user: { name: '', permission: '', projects: [] } };
    }

    handleGetWorkPlace = (user) => { this.setState({ user }); }

    render() {
        const { user } = this.state;
        console.log('render in App user', user);

        // const token = localStorage.getItem('jwt_token');
        // render={(props) => <PropsPage {...props} title={`Props through render`} />}
        let content = <></>;

        if (user.permission === 'admin') {
            content = (
                <>
                    <Route path="/project" component={ProjectDashboard} />
                    <Route path="/pack" component={PackDashboard} />
                    <Route path="/batch" component={BatchDashboard} />
                    <Route path="/video" component={VideoDashboard} />
                    <Route path="/task" component={TaskDashboard} />
                </>
            );
        } else if (user.permission === 'normal') {
            const tmp = user.projects.map((project) => (
                <Route
                    key={project}
                    path={`/workplace/${project.toLowerCase()}`}
                    render={(props) => <WorkPlace {...props} project={project} />}
                />
            ));
            content = (
                <>
                    {tmp}
                </>
            );
        }

        return (
            <Provider store={store}>
                <>
                    <Router>
                        <Header onGetWorkPlace={this.handleGetWorkPlace} />
                        <div className="container-full">
                            {content}
                            <Route path="/login" component={Login} />
                            <Route path="/logout" component={Logout} />
                        </div>
                    </Router>
                </>
            </Provider>
        );
    }
}

export default connect(null, {})(App);
ReactDom.render(<App />, document.getElementById('app'));
