import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';

import Header from './layout/Header';
import TaskDashboard from './tasks/Dashboard';
import ProjectDashboard from './projects/Dashboard';
import PackDashboard from './packs/Dashboard';
import BatchDashboard from './batchs/Dashboard';
import VideoDashboard from './videos/Dashboard';

import { Provider } from 'react-redux';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";



import store from '../store';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <Router>
                        <Header />
                        <div className="container">

                            <Route path="/project" component={ProjectDashboard} />
                            <Route path="/pack" component={PackDashboard} />
                            <Route path="/batch" component={BatchDashboard} />
                            <Route path="/video" component={VideoDashboard} />
                            <Route path="/task" component={TaskDashboard} />

                        </div>
                    </Router>
                </Fragment>
            </Provider>
        )
    }
}

ReactDom.render(<App />, document.getElementById('app'))

