import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../Apis/authApi";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ApiResponse } from "../../../interfaces/ApiResponse";
import { UserLoginModel } from "../../../interfaces/Auth/UserLoginModel";
import { UserModel } from "../../../interfaces/Auth/UserModel";
import { inputHelper } from "../../../Helper";
import { jwtDecode } from "jwt-decode";
import { setLoggedInUser } from "../../../Storage/Redux/userAuthSlice";
import { toastify } from "../../../Helper/toastify";

const Login: React.FC = () => {
  const [loginRequest] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<UserLoginModel>({
    username: "",
    password: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoading(true);
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: ApiResponse = await loginRequest(userInput);
    if (response.data) {
      const { accessToken,refreshToken } = response.data.result;
      const userData: UserModel = jwtDecode(accessToken);
      dispatch(setLoggedInUser(userData));
      navigate("/");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else if (response.error) {
      response.error.data.errorMessages.map((e: string) =>
        toastify(e, "error")
      );
    }

    setLoading(false);
  };

  return (
    <div
      className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
      style={{ width: "100vw" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          {loading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : (
            <div className="col-md-4">
              <div className="card-group">
                <div className="card p-4">
                  <div className="card-body">
                    <form method="post" onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">
                        Sign In to your account
                      </p>
                      <div className="input-group mb-3">
                        <input
                          className="form-control"
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          onChange={handleUserInput}
                          required
                        />
                      </div>
                      <div className="input-group mb-4">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                          autoComplete="current-password"
                          onChange={handleUserInput}
                          required
                        />
                      </div>
                      <button
                        className="btn btn-primary px-2 form-control"
                        type="submit"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
