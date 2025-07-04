import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-7 col-xl-6">
            <div className="card mx-4">
              <div className="card-body p-4">
                <form>
                  <h1>{t("Register")}</h1>
                  <p className="text-muted">{t("CreateYourAccount")}</p>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("Username")}
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">@</span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t("Email")}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={t("Password")}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={t("RepeatPassword")}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      {t("CreateAccount")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
