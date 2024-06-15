import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { useLoginMutation } from '../../../Apis/authApi'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { ApiResponse } from '../../../interfaces/ApiResponse'
import { UserLoginModel } from '../../../interfaces/UserLoginModel'
import { UserModel } from "../../../interfaces/UserModel";
import { inputHelper } from '../../../Helper'
import { jwtDecode } from "jwt-decode";
import { setLoggedInUser } from '../../../Storage/Redux/userAuthSlice'
import { toastify } from '../../../Helper/toastify'

const Login : React.FC = () => {
 const [loginRequest] = useLoginMutation();
 const dispatch = useDispatch();
 const navigator = useNavigate();
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
     console.log(response.data);
     const { token } = response.data.result;
     console.log(token);
     const userData: UserModel = jwtDecode(token);
     console.log(userData);
     dispatch(setLoggedInUser(userData));
     navigator("/");
     localStorage.setItem("token", token);
   } else if (response.error) {
     response.error.data.errorMessages.map((e: string) => toastify(e, "error"));
     console.log(response.error.data.errorMessages);
   }

   setLoading(false);
 };

  return (
    <div
      className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
      style={{ width: "100vw" }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          {loading ? (
            <div className="spinner-border text-primary" role="status">
            </div>
          ) : (
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm method="post" onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">
                        Sign In to your account
                      </p>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          onChange={handleUserInput}
                          required
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          name="password"
                          autoComplete="current-password"
                          onChange={handleUserInput}
                          required
                        />
                      </CInputGroup>
                          <CButton
                            color="primary"
                            className="px-2 form-control "
                            type="submit"
                            >
                            Login
                          </CButton>                        
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          )}
        </CRow>
      </CContainer>
    </div>
  );
}

export default Login
