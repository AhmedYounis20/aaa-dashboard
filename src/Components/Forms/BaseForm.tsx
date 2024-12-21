import { useState } from 'react';
import { FormTypes } from '../../interfaces/Components/FormType'
import Loader from '../Loader';

const BaseForm: React.FC<{
  formType: FormTypes;
  handleCloseForm: (() => void) | undefined;
  handleUpdate: (() => Promise<boolean>) | undefined;
  handleDelete: (() => Promise<boolean>) | undefined;
  handleAdd: (() => Promise<boolean>) | undefined;
  children: JSX.Element;
  isModal: boolean;
}> = ({
  formType,
  handleCloseForm = undefined,
  handleUpdate = undefined,
  handleDelete = undefined,
  handleAdd = undefined,
  children,
  isModal = true,
}) => {
  const [waitingResponse,setWaitingResponse]= useState<boolean>(false);


  const handleSubmit = async () => {
    setWaitingResponse(true);
    if (formType == FormTypes.Add && ( handleAdd && await handleAdd())&& handleCloseForm) 
      handleCloseForm();
    else if (formType == FormTypes.Edit && (handleUpdate && await handleUpdate()) && handleCloseForm)
      handleCloseForm();
    else if (formType == FormTypes.Delete && (handleDelete && await handleDelete()) && handleCloseForm)
      handleCloseForm();
    setWaitingResponse(false);
  };
  return (
    <div className={`${isModal && "modal "} fade show d-block modal-xl `}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          {isModal && (
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {FormTypes[formType].toString()}
              </h5>
              <button
                type="button"
                className="close btn"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseForm}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            {isModal && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseForm}
                disabled={waitingResponse}
                style={{ height: 40 }}
              >
                Close
              </button>
            )}
            {formType !== FormTypes.Details && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: 40 }}
                onClick={async () => await handleSubmit()}
                disabled={waitingResponse}
              >
                {waitingResponse ? (
                  <Loader height={"5px"} color="text-white" />
                ) : (
                  <>{formType == FormTypes.Delete ? "Delete" : "Save"}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseForm