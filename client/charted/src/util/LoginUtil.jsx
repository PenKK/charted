import { login } from "./API";
import { setCookie } from "./CookieManager";

export async function loginUser(formData) {
  try {
    return await login(formData);
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function loginAfterRegister(email, password) {
  const validateLoginPromise = await login(email, password);

  try {
    await loginUser(validateLoginPromise, email);
  } catch (err) {
    return new Error(err.data);
  }
}

export function getErrorMessage(erroredLoginPromise) {
  switch (erroredLoginPromise.status) {
    case 500:
      return "Email or password incorrect";
    default:
      return "Server error, please try again later";
  }
}
