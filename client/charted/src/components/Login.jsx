import FormInput from "./inputs/FormInput";
import { useState } from "react";
import "./css/LoginRegister.css";
import { loginUser } from "../util/LoginUtil";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);

  async function submitLogin(e) {
    e.preventDefault();
    setDisableSubmit(true);
    setErrorMessage("");

    const formData = new FormData(e.target);
    const accountData = Object.fromEntries(formData);
    const loginErrorMessage = await loginUser(accountData);

    if (loginErrorMessage == null) {
      setErrorMessage("Unable to reach the server");
    } else if (loginErrorMessage.status === 404) {
      setErrorMessage(loginErrorMessage.data);
    } else if (loginErrorMessage.status === 200) {
      location.href = "/u";
    }

    setDisableSubmit(false);
  }

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Email",
      pattern: "^\\S+@\\S+\\.\\S+$",
      errorMessage: "Email is invalid",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "password",
      required: true,
    },
  ];

  return (
    <div id="border-wrap">
      <div id="login-box" className="d-flex flex-column p-4 pt-5 pb-5">
        <div>
          <form id="loginForm" className="text-center" onSubmit={submitLogin}>
            {inputs.map(input => (
              <FormInput key={input.id} {...input}></FormInput>
            ))}
            {errorMessage !== "" && <div className="text-danger mb-4">{errorMessage}</div>}
            <button className="btn submit-btn" type="submit" disabled={disableSubmit ? true : false}>
              Log in
            </button>
          </form>
        </div>
        <button
          id="page-swap-button"
          className="align-self-center"
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          Make an account
        </button>
      </div>
    </div>
  );
}
