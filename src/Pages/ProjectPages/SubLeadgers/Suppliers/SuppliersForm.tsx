import { useEffect } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/FormType';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import { useDeleteSupplierByIdMutation, useGetSuppliersByIdQuery } from '../../../../Apis/SuppliersApi';

const SuppliersForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const [deleteFunc] = useDeleteSupplierByIdMutation();

  const { data, isLoading } = useGetSuppliersByIdQuery(id);
  useEffect(() => {
    console.log(data);
  }, [isLoading]);

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      return true;
    } else {
      console.log(response);

      response.error?.data?.errorMessages?.map((error) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        id={id}
        handleCloseForm={handleCloseForm}
        handleDelete={async () => await handleDelete()}
      >
        <div>
          {isLoading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  are you sure, you want delete {data.result.nameSecondLanguage}
                </p>
              ) : (
                <>
                  <div className="row">
                    <div className="col col-md-6">
                      <input
                        type="text"
                        className="form-input form-control"
                        disabled={formType === FormTypes.Details}
                        value={data.result["name"]}
                      />
                    </div>
                    <div className="col col-md-6">
                      <input
                        type="text"
                        className="form-input form-control"
                        disabled={formType === FormTypes.Details}
                        value={data.result["nameSecondLanguage"]}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default SuppliersForm;
