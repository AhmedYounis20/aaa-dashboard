import { useTranslation } from "react-i18next";

const Page500 = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center">
              <h1 className="display-3">500</h1>
              <h4 className="pt-3">{t("HoustonProblem")}</h4>
              <p className="text-muted">
                {t("PageTemporarilyUnavailable")}
              </p>
            </div>
            <div className="input-group mt-4">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={t("WhatAreYouLookingFor")}
              />
              <button className="btn btn-info ms-2">{t("Search")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Page500
