import api from "../../../api/api";

//login action

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "loginRequest" });
    const data = await api(
      "/user/login",
      {
        email,
        password,
      },
      "POST",
    );

    dispatch({ type: "loginSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "loginFail",
      payload: error.message || "Login failed",
    });
    throw error;
  }
};

//signup action
export const signup =
  (name, email, password, address, city, country, phone) => async (dispatch) => {
    try {
      dispatch({ type: "signupRequest" });
      const data = await api(
        "/user/signup",
        {
          name,
          email,
          password,
          address,
          city,
          country,
          phone,
        },
        "POST",
      );

      dispatch({ type: "signupSuccess", payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: "signupFail",
        payload: error.message || "Signup failed",
      });
      throw error;
    }
  };

//Get User data action
export const getUserData = () => async (dispatch) => {
  try {
    dispatch({ type: "getUserDataRequest" });
    const data = await api("/user/profile", "", "get");
    dispatch({ type: "getUserDataSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "getUserDataFail",
      payload: error.message || "Failed to get user data",
    });
    throw error;
  }
};

//Logout Action
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "logoutRequest" });
    const data = await api("/user/logout", null, "POST");
    dispatch({ type: "logoutSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "logoutFail",
      payload: error.message || "Logout failed",
    });
    throw error;
  }
};
 
