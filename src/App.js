import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { StoreProvider } from "./context/Store";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <StoreProvider>
      <div className='main-background'>
        {currentUser && (
          <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <Link to={"/"} className='navbar-brand mx-2'>
              User
            </Link>
            <div className='navbar-nav mr-auto'>
              {currentUser && (
                <li className='nav-item'>
                  <Link to={"/dashboard"} className='nav-link'>
                    Dashboard
                  </Link>
                </li>
              )}
            </div>

            {currentUser ? (
              <div className='navbar-nav ml-auto'>
                <li className='nav-item'>
                  <a href='/login' className='nav-link' onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </div>
            ) : (
              <div className='navbar-nav ml-auto'>
                <li className='nav-item'>
                  <Link to={"/login"} className='nav-link'>
                    Login
                  </Link>
                </li>
              </div>
            )}
          </nav>
        )}

        <div className={"container " + (currentUser ? "mt-3" : "")}>
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route path='/dashboard' component={Dashboard} />
          </Switch>
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
