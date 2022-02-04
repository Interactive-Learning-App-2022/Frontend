import React from 'react';
import { Link } from 'react-router-dom';
import MUtil from 'util/mm.jsx'
import User from 'service/user-service.jsx'

const _mm = new MUtil();
const _user = new User();

class NavTop extends React.Component {
    constructor(props) {
        super(props);
        try {
            this.state = {
                fullname: _mm.getStorage('userInfo').data.user.first_name + " " + _mm.getStorage('userInfo').data.user.last_name
                    || '',
                role: _mm.getStorage('userInfo').data.user.groups[0],
                token: _mm.getStorage('userInfo').data.token
            }
        } catch (e) {
            this.state = {
                fullname: '',
                role: '',
                token: ''
            }
        }
    }
    // logout
    onLogout() {
        window.location.href = '/';
        console.log(this.state.token)
        _user.logout(this.state.token);
        localStorage.clear();
    }
    render() {
        return (
            <div className="navbar navbar-default top-navbar" style={{
                backgroundColor: "#00276C", borderRadius: "0px", padding: "0px", position: "fixed"
            }}>

                <ul className="nav navbar-top-links navbar-left">
                    <a href="/"><img src="/resources/logo.png" style={{ padding: "15px", display: "block", width: "66%" }}></img></a>
                </ul>

                <ul className="nav navbar-top-links navbar-right">

                    <li className="dropdown">
                        <a className="dropdown-toggle" href="javascript:;">
                            <i className="fa fa-user fa-fw" style={{ color: "white" }}></i>
                            <span style={{ color: "white" }}>
                                {
                                    this.state.fullname
                                        ? <span>Welcome, {this.state.fullname}</span>
                                        : <span>Welcome</span>
                                }
                            </span>
                        </a>
                        <ul className="dropdown-menu dropdown-user">
                            <li>
                                <a onClick={() => { this.onLogout() }}>
                                    <i className="fa fa-sign-out fa-fw"></i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>


                </ul>
            </div>
        );
    }
}

export default NavTop;
