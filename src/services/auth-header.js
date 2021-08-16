import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function authHeader() {
  const user = cookies.get("user");

  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
