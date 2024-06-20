import { FormTypes } from '../../interfaces/Components/FormType'


const BaseForm: React.FC<{
  formType: FormTypes;
  handleCloseForm: () => void;
  handleUpdate: (() => Promise<boolean>) | undefined;
  handleDelete: (() => Promise<boolean>) | undefined;
  handleAdd: (() => Promise<boolean>) | undefined;
  children: JSX.Element;
  isModal: boolean;
}> = ({
  formType,
  handleCloseForm,
  handleUpdate,
  handleDelete,
  handleAdd,
  children,
  isModal = true,
}) => {
  const handleSubmit = async () => {
    if (formType == FormTypes.Add && (await handleAdd())) handleCloseForm();
    else if (formType == FormTypes.Edit && (await handleUpdate()))
      handleCloseForm();
    else if (formType == FormTypes.Delete && (await handleDelete()))
      handleCloseForm();
  };
  return (
    <div className={`${isModal && "modal "} fade show d-block modal-lg `}>
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
              >
                Close
              </button>
            )}
            {formType !== FormTypes.Details && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => await handleSubmit()}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseForm