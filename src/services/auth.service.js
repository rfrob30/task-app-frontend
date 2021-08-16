import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const API_URL = process.env.REACT_APP_API_URL;

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data) {
        cookies.set("user", response.data);
      }

      return response.data;
    });
};

const logout = () => {
  cookies.remove("user");
};

const getCurrentUser = () => {
  return cookies.get("user");
};

const auth = {
  login,
  logout,
  getCurrentUser,
};

export default auth;
