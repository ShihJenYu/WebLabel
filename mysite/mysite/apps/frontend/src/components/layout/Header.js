import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';

import axios from 'axios';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { user: { name: '', permission: '', projects: [] } };
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
        const token = localStorage.getItem('jwt_token');
        console.log('user', user);
        let username = '';
        let content = <></>;
        let content2 = <></>;

        if (user.permission === 'admin') {
            content = (
                <>
                    <Nav.Link href="/project">Project</Nav.Link>
                    <Nav.Link href="/pack">Pack</Nav.Link>
                    <Nav.Link href="/video">Video</Nav.Link>
                    <Nav.Link href="/batch">Batch</Nav.Link>
                </>
            );
        } else if (user.permission === 'normal') {
            const tmp = user.projects.map((project) => (
                <NavDropdown.Item key={project} href={`/workplace/${project.toLowerCase()}`}>{project}</NavDropdown.Item>
            ));
            content = (
                <>
                    <NavDropdown title="WorkPlace" id="basic-nav-dropdown">
                        {tmp}
                    </NavDropdown>
                </>
            );
        }

        if (token === null) {
            username = 'guest';
            content2 = (
                <>
                    <Nav.Link href="/login">Login</Nav.Link>
                </>
            );
        } else {
            username = user.name;
            content2 = (
                <>
                    <Nav.Link href="/logout">Logout</Nav.Link>
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
                        {username}
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
