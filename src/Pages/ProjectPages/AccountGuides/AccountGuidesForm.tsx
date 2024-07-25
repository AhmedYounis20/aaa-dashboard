import { useEffect, useState } from 'react';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { AccountGuideModel } from '../../../interfaces/ProjectInterfaces';
import { TextField } from '@mui/material';
import { useCreateAccountGuideMutation, useDeleteAccountGuideMutation, useGetAccountGuidesByIdQuery, useUpdateAccountGuideMutation } from '../../../Apis/AccountGuidesApi';
import { toastify } from '../../../Helper/toastify';
import { ApiResponse } from '../../../interfaces/ApiResponse';

const AccountGuidesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id , handleCloseForm }) => {
  const accountGuidesResult = useGetAccountGuidesByIdQuery(id);
  const [model, setModel] = useState<AccountGuideModel>({
    id:"",
    name:"",
    nameSecondLanguage:""
  });
    const [isLoading, setIsLoading] = useState<boolean>(
      formType != FormTypes.Add
    );
  const [updateGuide] = useUpdateAccountGuideMutation();
  const [createGuide] = useCreateAccountGuideMutation();
  const [deleteGuide] = useDeleteAccountGuideMutation();

  useEffect(() => {
    if(formType != FormTypes.Add){
      if (!accountGuidesResult.isLoading) {
        setModel(accountGuidesResult.data.result);
        setIsLoading(false);
      }
    }
  }, [accountGuidesResult.isLoading, accountGuidesResult?.data?.result,formType]);

   const handleDelete = async (): Promise<boolean> => {
     const response: ApiResponse = await deleteGuide(id);
     if (response.data) {
       toastify(response.data.successMessage);
       return true;
     } else {
       console.log(response);
       response.error?.data?.errorMessages?.map((error: string) => {
         toastify(error, "error");
         console.log(error);
       });
       return false;
     }
   };
   const handleUpdate = async () => {
     const response: ApiResponse = await updateGuide(model);
     if (response.data) {
       toastify(response.data.successMessage);
       return true;
     } else if (response.error) {
       toastify(response.error.data.errorMessages[0], "error");
       return false;
     }
     return false;
   };
   const handleAdd = async () => {
     const response: ApiResponse = await createGuide(model);
     if (response.data) {
       toastify(response.data.successMessage);
       console.log(response);
       return true;
     } else if (response.error) {
       toastify(response.error.data.errorMessages[0], "error");
       return false;
     }
     return false;
   };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        isModal
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      >
        <div>
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(event) =>
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, name: event.target.value }
                              : prevModel
                          )
                        }
                      />
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="NameSecondLanguage"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(event) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nameSecondLanguage: event.target.value,
                                }
                              : prevModel
                          )
                        }
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

export default AccountGuidesForm;
