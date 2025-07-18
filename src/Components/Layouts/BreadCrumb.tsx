import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const capitalize = (s: string) =>{
  const path = s.charAt(0).toUpperCase() + s.slice(1);
  console.log("path: ", path);
  return path;
}

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x :string) => x);

  return (
            <nav aria-label={t("Breadcrumb")}>
      <ol className="breadcrumb flex list-none p-0 m-0 bg-gray-100 py-2 rounded">
        <li className="breadcrumb-item">
          <Link to="/" className="text-blue-600 hover:underline">
            {t("Home")}
          </Link>
        </li>
        {pathnames.map((value :string, index:number) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={to} className="breadcrumb-item active text-gray-500">
              {capitalize(value)}
            </li>
          ) : (
            <li
              key={to}
              className="breadcrumb-item before:content-['/'] before:mx-2"
            >
              <Link to={to} className="text-blue-600 hover:underline">
                {capitalize(value)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
