import React from 'react';
import MUtil from 'util/mm.jsx';
import Class from 'service/class-service.jsx';
import { VueInReact } from 'vuera';

const _mm = new MUtil();
const _class = new Class();

import './index.scss'
import Module from 'component/vue-components/modules/game/module.vue';

class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      userID: _mm.getStorage('userInfo').data.user.id,
      api_token: _mm.getStorage('userInfo').data.token,
      role: _mm.getStorage('userInfo').data.user.groups[0],
      selected: [],
      taskID: this.props.match.params.taskID,
      taskList: []

    };
  }
  componentDidMount() {
    this.checkLogin();
    _mm.setStorage("taskcookie", this.state.taskID)
    if (this.state.role == '2') {
      this.StartTask();
    }

  }
  StartTask() {
    let Info = {};
    Info.api_token = this.state.api_token;
    Info.taskID = this.state.taskID;
    _class.getAssignedTask(Info).then(res => {
      this.ChangeJson(res.data);
    }, errMsg => {
      _mm.errorTips(errMsg);
    });
  }

  ChangeJson(param) {
    param.status = "1";
    console.log("This is param.", param);
    let Info = {};
    Info.api_token = this.state.api_token;
    Info.taskID = this.state.taskID;
    Info.data = param;
    _class.putNewTaskStatus(Info).then({}, errMsg => {
      _mm.errorTips(errMsg);
    });
  }

  checkLogin() {
    if (localStorage.getItem("userInfo") === null) {
      window.location.href = '/login';
    }
  }

  render() {
    const Component = VueInReact(Module)
    let styles = {
      paddingTop: '60px',
      mariginTop: '50px'
    }

    return (
      <div id="page-wrapper" style={styles}>
        <Component></Component>
      </div>
    )
  }

}

export default Media;