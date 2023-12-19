import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useContext, useState } from "react";

import "./login.css";
import AuthContext from "../context/AuthProvider";
import { login } from "../Apis/Api";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

function Loggin() {
  const { setAuth } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [focused, setFocused] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Tài khoản",
      errorMessage:
        "Tài khoản từ 3 đến 16 kí tự và không bao gồm kí tự đặc biệt",
      label: "Tài khoản",
      // pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Mật khẩu",
      errorMessage:
        "Mật khẩu từ 8 đến 20 kí tự bao gồm ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt",
      label: "Mật khẩu",
      // pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
  ];
  const navigate = useNavigate();
  const loginMutation = useMutation(login);
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: values.username,
      password: values.password,
    };
    loginMutation.mutate(body, {
      onSuccess: (response) => {
        console.log(response.data);

        setAuth(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setValues({
          username: "",
          password: "",
        });
        if (response.data.role === "admin") navigate("/HomeView");
        else {
          navigate("HomeViewUser");
        }
      },
    });
  };
  const handleFocus = (e) => {
    setFocused(true);
  };
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>
        {inputs.map((input, index) => (
          <div className="formInput" key={index}>
            <label>{input.label}</label>
            <input
              onBlur={handleFocus}
              value={values[input.name]}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder}
              required={input.required}
              onChange={onChange}
            ></input>
          </div>
        ))}

        {/* <Link
          to={"/SignUp"}
          style={{
            color: "blueviolet",
            textDecoration: "none",
            display: "block",
          }}
          // className=" icon-link-hover"
        >
          Nếu chưa có tài khoản. Đăng kí ngay
        </Link> */}

        <button className="rounded my-2">Đăng nhập</button>
      </form>
    </div>
  );
}
export default Loggin;
