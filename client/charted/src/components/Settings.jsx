import { useLayoutEffect, useRef, useState } from "react";
import "./css/settings.css";
import { getCookie, setCookie } from "../util/CookieManager";
import { changeEmail, changePassword, changeUsername, login } from "../util/API";
import spinner from "../assets/spinner.svg";
import check from "../assets/check.svg";
import x from "../assets/x.svg";

export default function Settings({ setNavBarUsername }) {
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  const [currentName, setCurrentName] = useState(getCookie("username"));
  const [currentEmail, setCurrentEmail] = useState(getCookie("email"));

  const [nameProcessingState, setNameProcessingState] = useState(0); // 0 - inactive, 100 - loading, 200 - success, 400+ - failed
  const [emailProcessingState, setEmailProcessingState] = useState(0);
  const [passwordProcessingState, setPasswordProcessingState] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const newPasswordRef = useRef(null);
  const shrinkGrowRef = useRef(null);

  async function handleSaveInfo(e) {
    e.preventDefault();
    const formJSON = Object.fromEntries(new FormData(e.target));
    console.log(formJSON);

    if (formJSON.username != currentName) {
      handleUsername();
    }
    if (formJSON.email != currentEmail) {
      handleEmail();
    }

    async function handleUsername() {
      setUsernameError("");
      setNameProcessingState(100);

      const result = await changeUsername(formJSON);
      setNameProcessingState(result.status);

      switch (result.status) {
        case 200:
          setCurrentName(result.data.newUsername);
          setCookie("username", result.data.newUsername);
          setNavBarUsername(result.data.newUsername);
          break;
        case 409:
          setUsernameError("Username already in use, please choose a different one");
          break;
        case 401:
          setUsernameError("Unauthorized, please login and try again");
          break;
        case 404:
          setUsernameError("Unable to reach server, please try again later");
          break;
        default:
          setUsernameError("An unexpected error occured");
      }
    }

    async function handleEmail() {
      setEmailError("");
      setEmailProcessingState(100);

      const result = await changeEmail(formJSON);
      setEmailProcessingState(result.status);

      switch (result.status) {
        case 200:
          setCurrentEmail(result.data.newEmail);
          setCookie("email", result.data.newEmail);
          break;
        case 409:
          setEmailError("This email is already in use");
          break;
        case 404:
          setEmailError("Unable to reach server, please try again later");
          break;
        default:
          setEmailError("An unexpected error occured");
      }
    }

    setEditingName(false);
    setEditingEmail(false);
  }

  setTimeout(() => {
    document.body.className = "";
  }, 300);

  async function handleSavePassword(e) {
    e.preventDefault();
    setPasswordError("");
    const formData = Object.fromEntries(new FormData(e.target));
    setPasswordProcessingState(100);

    const result = await changePassword(formData);
    setPasswordProcessingState(result.status);
    setEditingPassword(false);

    switch (result.status) {
      case 200:
        break;
      case 401:
        setPasswordError("Previous password is incorrect");
        break;
      case 500:
        setPasswordError("An unexpected error occured");
        break;
      default:
        setPasswordError("Unable to reach server, please try again later");
        setPasswordProcessingState(404);
    }

    newPasswordRef.current.value = "";
  }

  function getStatusIcon(status) {
    switch (status) {
      case 0:
        return;
      case 100:
        return spinner;
      case 200:
        return check;
      default:
        return x;
    }
  }

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    // WORKS WITH STRICT MODE OFF
    shrinkGrowRef.current.style.animation = editingPassword ? "grow 300ms forwards" : "shrink 300ms forwards";
  });

  function Line() {
    return (
      <div className="d-flex justify-content-center mb-4">
        <div className="line-grad grad-left"></div>
        <div className="line"></div>
        <div className="line-grad grad-right"></div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <div ref={shrinkGrowRef} className={`d-flex flex-column settings-container`}>
        <h2 className="settings-header">SETTINGS</h2>
        <Line />
        <form onSubmit={handleSaveInfo}>
          <div className="mb-4">
            <h4 className="account-header">
              ACCOUNT NAME <img src={getStatusIcon(nameProcessingState)} className={`icon-status ${nameProcessingState == 100 && "icon-spinner"}`} />
            </h4>
            <div className="d-flex align-items-center">
              <input required name="username" pattern="^[A-Za-z0-9]{3,16}" className="account-info-input" defaultValue={currentName} />
              <div className={`flex-grow-1 justify-content-center d-flex ${usernameError == "" && "hide-txt"}`}>
                <h4 className={`text-danger settings-error-txt ${usernameError == "" && "hide-txt"}`}>{usernameError}</h4>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="account-header">
              EMAIL <img src={getStatusIcon(emailProcessingState)} className={`icon-status ${emailProcessingState == 100 && "icon-spinner"}`} />
            </h4>
            <div className="d-flex align-items-center">
              <input required name="email" pattern="^\S+@\S+\.\S+$" className="account-info-input" defaultValue={currentEmail} />
              <div className={`flex-grow-1 justify-content-center d-flex ${emailError == "" && "hide-txt"}`}>
                <h4 className={`text-danger settings-error-txt ${emailError == "" && "hide-txt"}`}>{emailError}</h4>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <button className="btn settings-btn">
              <h3 className="settings-btn-text">Save</h3>
            </button>
            <button
              type="button"
              className="btn settings-btn"
              onClick={() => {
                setEditingEmail(false);
                setEditingName(false);
              }}
            >
              <h3 className="settings-btn-text">Cancel</h3>
            </button>
          </div>
        </form>

        <form onSubmit={handleSavePassword}>
          <div className="mb-4">
            <h4 className="account-header">
              {editingPassword ? "NEW PASSWORD" : "PASSWORD"} <img src={getStatusIcon(passwordProcessingState)} className={`icon-status ${passwordProcessingState == 100 && "icon-spinner"}`} />
            </h4>
            <div className="d-flex align-items-center">
              <input
                ref={newPasswordRef}
                required
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                onFocus={() => setEditingPassword(true)}
                type="password"
                name="password"
                pattern="^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$~!%*#?&])[A-Za-z0-9@$~!%*#?&]{8,128}$"
                className="account-info-input"
                placeholder={editingPassword ? null : "●●●●●●●●●●"}
              />
              <div className={`flex-grow-1 justify-content-center d-flex ${passwordError == "" && "hide-txt"}`}>
                <h4 className={`text-danger settings-error-txt ${passwordError == "" && "hide-txt"}`}>{passwordError}</h4>
              </div>
            </div>
          </div>
          {editingPassword && (
            <div className="position-absolute">
              <div className="mb-4">
                <h4 className="account-header">CONFIRM PASSWORD</h4>
                <input required name="confirmPassword" type="password" pattern={newPassword} className="account-info-input" />
              </div>

              <div className="mb-4">
                <h4 className="account-header">PREVIOUS PASSWORD</h4>
                <input required name="previousPassword" type="password" className="account-info-input" />
              </div>

              <div>
                <button className="btn settings-btn">
                  <h3 className="settings-btn-text">Save</h3>
                </button>
                <button
                  type="button"
                  className="btn settings-btn"
                  onClick={() => {
                    setEditingPassword(false);
                    setNewPassword("");
                    newPasswordRef.current.value = "";
                  }}
                >
                  <h3 className="settings-btn-text">Cancel</h3>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
