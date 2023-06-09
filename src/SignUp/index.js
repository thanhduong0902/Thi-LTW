import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useContext, useState } from "react";

import "./signup.css";
import AuthContext from "../context/AuthProvider";
import { signUp } from "../Apis/Api";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

function SignUp() {
  const [focused, setFocused] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Tài khoản",

      label: "Tài khoản",

      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",

      require: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Mật khẩu",

      label: "Mật khẩu",

      required: true,
    },
  ];
  const navigate = useNavigate();
  const signUpMutation = useMutation(signUp);
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    signUpMutation.mutate(body, {
      onSuccess: (response) => {
        if (response.data.results.message) {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: response.data.results.message,
          });
        } else {
          Swal.fire({
            title: "Đăng ký thành công",
            showConfirmButton: true,
            confirmButtonText: "Đăng nhập",
          }).then((result) => {
            if (result.isConfirmed) {
              setValues({
                username: "",
                email: "",
                password: "",
              });
              navigate("/");
            }
          });
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
        <h1>Đăng Ký</h1>
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
        <button>Đăng Ký</button>
      </form>
    </div>
  );
}
export default SignUp;
