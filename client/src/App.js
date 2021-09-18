import React, { useEffect } from "react";
import Form from "./components/Form";
import WelcomeScreen from "./components/WelcomeScreen";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SearchForm from "./components/SearchForm";
import SearchResult from "./components/SearchResult";
import NannyProfile from "./components/NannyProfile";
import EditProfile from "./components/EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "./redux/authReducer";

function App() {
  const history = useHistory();
  const token = useSelector((state) => state.authR.token);
  const userData = useSelector((state) => state.authR.userData);
  const isLoading = useSelector((state) => state.authR.status);

  const dispatch = useDispatch();
  //useeffect = blocking call

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(getToken({ token }));
  }, [token]);
  const redirectDashboard = () => {
    history.push(`/${userData?.type}/dashboard`);
  };
  const redirectHome = () => {
    history.replace("/");
  };
  // if (isLoading === "loading") return <h1>LOADING</h1>;
  // maybe add if userData exists with loading
  if (!userData) {
    return window?.location?.pathname !== "/" ? (
      redirectHome()
    ) : (
      <Route exact path="/">
        <WelcomeScreen />
        <Form />
      </Route>
    );
  } else
    return (
      <Switch>
        {userData?.type === "parent" ? (
          <>
            <Route path="/parent/dashboard">
              <Dashboard type="parent" />
            </Route>

            <Route
              exact
              path="/parent/search/results"
              component={SearchResult}
            />
            <Route
              exact
              path="/parent/search/:servicetype"
              component={SearchForm}
            />
            <Route
              exact
              path="/parent/search/results/profile/:nanny_id"
              component={NannyProfile}
            />
            <Route exact path="/profile" component={EditProfile} />
          </>
        ) : (
          redirectDashboard()
        )}

        {userData?.type === "nanny" ? (
          <>
            <Route path="/nanny/dashboard">
              <Dashboard type="nanny" />
            </Route>
            <Route path="/profile" component={EditProfile} />
          </>
        ) : (
          redirectDashboard()
        )}
        {userData?.type && redirectDashboard()}
      </Switch>
    );
}

export default App;
