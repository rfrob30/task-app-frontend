import React, { useState, useRef, useContext, useEffect } from "react";
import { Store } from "../context/Store";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { Grid } from "@material-ui/core";

const required = (value) => {
  if (!value) {
    return (
      <div className='alert alert-danger' role='alert'>
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const { state, dispatch } = useContext(Store);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!!state.isLoggedIn) {
      props.history.push("/dashboard");
      window.location.reload();
    }
  }, [state.isLoggedIn]);

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(email, password).then(
        () => {
          dispatch({ type: "login", isLoggedIn: true });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: "100vh" }}>
      <Grid item xs={12}>
        <Form onSubmit={handleLogin} ref={form} className='card card-container'>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <Input
              type='text'
              className='form-control'
              name='email'
              value={email}
              onChange={onChangeEmail}
              validations={[required]}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <Input
              type='password'
              className='form-control'
              name='password'
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className='form-group'>
            <button
              className='btn btn-primary btn-block mt-2 '
              disabled={loading}>
              {loading && (
                <span className='spinner-border spinner-border-sm'></span>
              )}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className='form-group'>
              <div className='alert alert-danger' role='alert'>
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </Grid>
    </Grid>
  );
};

export default Login;
