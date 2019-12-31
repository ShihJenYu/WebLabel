import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { user: { name: 'guest', permission: '', projects: [] } };
    }

    componentDidMount() {
        const { user } = this.state;
        const { onGetWorkPlace } = this.props;
        console.log('componentDidMount in Header', user);
        const token = localStorage.getItem('jwt_token');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;

        axios.get('/api/v1/server/workplace/')
            .then((res) => {
                user.name = res.data.name;
                user.permission = res.data.permission;
                user.projects = res.data.projects || [];
                this.setState({ user },
                    () => {
                        console.log('onGetWorkPlace');
                        onGetWorkPlace(user);
                    });
            });
    }

    render() {
        const { user } = this.state;
        // const token = localStorage.getItem('jwt_token');
        console.log('user', user);
        let content = <></>;
        let content2 = <></>;

        if (user.permission === 'admin') {
            content = (
                <>
                    <NavLink to="/project" className="nav-link" activeClassName="active">Project</NavLink>
                    <NavLink to="/pack" className="nav-link" activeClassName="active">Pack</NavLink>
                    <NavLink to="/batch" className="nav-link" activeClassName="active">Batch</NavLink>
                    <NavLink to="/video" className="nav-link" activeClassName="active">Video</NavLink>
                </>
            );
        } else if (user.permission === 'normal') {
            const tmp = user.projects.map((project) => (
                <NavLink className="nav-link" key={project} to={`/workplace/${project.toLowerCase()}`}>{project}</NavLink>
            ));
            content = (
                <>
                    <NavDropdown title="WorkPlace" id="basic-nav-dropdown">
                        {tmp}
                    </NavDropdown>
                </>
            );
        }

        if (user.name === 'guest') {
            content2 = (
                <>
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                </>
            );
        } else {
            content2 = (
                <>
                    <NavLink className="nav-link" to="/logout">Logout</NavLink>
                </>
            );
        }

        return (
            <Navbar bg="light" expand="sm">
                <Navbar.Brand href="/">MySite</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {content}
                    </Nav>
                    <Navbar.Text>
                        {'User: '}
                        {user.name}
                    </Navbar.Text>
                    <Nav className="">
                        {content2}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

Header.propTypes = {
    onGetWorkPlace: PropTypes.func.isRequired,
};

export default connect(null, {})(Header);
