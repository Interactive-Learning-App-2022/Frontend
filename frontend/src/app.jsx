import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
} from "react-router-dom";

import Layout from "component/layout/index.jsx";
import Home from "page/home/index.jsx";
import Courses from "page/courses/index.jsx";
import Login from "page/login/index.jsx";
import UserList from "page/user/index.jsx";
import ClassDetail from "page/class-detail/index.jsx";
import Benchmark from "page/benchmark/index.jsx";
import ErrorPage from "page/error/index.jsx";
import Media from "page/media/index.jsx";
import Register from "page/signup/index.jsx";
import Game from "page/game/index.jsx";
import Task from "page/tasks/index.jsx";
import Record from "page/record/index.jsx";
import TargetDetail from "page/target-detail/index.jsx";
import P_page from "page/proficient-page/index.jsx";
import TaskDetail from "page/task-details/index.jsx";
import Standards from "page/standards/index.jsx";
import Assessments from "page/assessment/index.jsx";
import Student_Assessment from "page/student-assessment/index.jsx";

import "bootstrap";

class App extends React.Component {
  render() {
    let LayoutRouter = (
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/courses" component={Courses} />
          <Route exact path="/classroom/:classID" component={ClassDetail} />
          <Route
            exact
            path="/classroom/:classID/p-page"
            component={Benchmark}
          />
          <Route
            exact
            path="/standards/:classID/:subjectID"
            component={Standards}
          />
          {/* This doesn't lead to anything */}
          {/* <Route exact path="/assessment" component={Assessments} /> */}
          <Route
            exact
            path="/assessment/:classID/:userID"
            component={Student_Assessment}
          />
          <Route
            exact
            path="/assessment/:classID/:userId/:assessmentID/:assessmentName"
            component={Assessments}
          />
          <Route path="/user/index" component={UserList} />
          <Route exact path="/video" component={Media} />
          {/* Throws more errors than the Route below, use 4 as TaskID */}
          {/* <Route exact path="/game" component={Game} /> */}
          <Route exact path="/game/:taskID" component={Game} />
          <Route exact path="/tasks/:classID" component={Task} />
          <Route exact path="/tasks/:classID/:userID" component={TaskDetail} />
          <Route exact path="/records/:recordID" component={Record} />
          {/* This is conflicts with classdetails */}
          {/* <Route exact path="/classroom/:classID" component={Benchmark} /> */}
          <Route
            exact
            path="/classroom/:classID/:targetID"
            component={TargetDetail}
          />
          <Redirect exact from="/user" to="/user/index" />
          <Route component={ErrorPage} />
        </Switch>
      </Layout>
    );
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" render={(props) => LayoutRouter} />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
