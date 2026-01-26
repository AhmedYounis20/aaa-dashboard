import { useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { QrCodeScanner } from "@mui/icons-material";

const BarCodesInput: React.FC<{
  formType: FormTypes;
  barCodes: string[];
  handleTranslate: (key: string) => string;
  handleUpdate: (barCodes: string[]) => void;
}> = ({ formType, barCodes, handleUpdate, handleTranslate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bindedBarCode, setBindedBarCode] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedBarCode, setEditedBarCode] = useState<string>("");

  const handleOpen = () => setIsOpen((prev) => !prev);

  const handleAddBarCode = () => {
    const trimmed = bindedBarCode.trim();
    if (trimmed && !barCodes.includes(trimmed)) {
      handleUpdate([...barCodes, trimmed]);
      setBindedBarCode("");
    }
  };

  const handleRemoveBarCode = (index: number) => {
    const updated = [...barCodes];
    updated.splice(index, 1);
    handleUpdate(updated);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedBarCode(barCodes[index]);
  };

  const handleSaveEdit = () => {
    if (!editedBarCode.trim()) return;
    const updated = [...barCodes];
    updated[editingIndex!] = editedBarCode.trim();
    handleUpdate(updated);
    setEditingIndex(null);
    setEditedBarCode("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedBarCode("");
  };

  return (
    <>
      <button
        className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2 px-4 rounded-lg shadow-sm text-white hover:shadow-md transition"
        onClick={handleOpen}
      >
        <QrCodeScanner fontSize="small" />
        <span className="fw-semibold">{handleTranslate("BarCodes")}</span>
      </button>
      {isOpen && (
        <div className="modal fade show d-block bg-black bg-opacity-50">
          <div className="modal-dialog modal-xs" role="document">
            <div className="modal-content rounded-xl shadow-lg">
              <div className="modal-header px-4 py-3 border-b border-gray-200 flex-row justify-between">
                <h5 className="modal-title text-xl font-semibold">
                  {handleTranslate("BarCodes")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleOpen}
                ></button>
              </div>

              <div className="modal-body p-4 space-y-5">
                {/* Add New Barcode */}
                {formType != FormTypes.Details && (
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={bindedBarCode}
                      placeholder={handleTranslate("NewBarcode")}
                      onChange={(e) => setBindedBarCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddBarCode()}
                    />
                    <button
                      className="btn btn-success"
                      onClick={handleAddBarCode}
                    >
                      {handleTranslate("Add")}
                    </button>
                  </div>
                )}

                {/* Barcode List */}
                <ul className="list-group">
                  {barCodes.map((code, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {editingIndex === index ? (
                        <div className="w-100 d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={editedBarCode}
                            onChange={(e) => setEditedBarCode(e.target.value)}
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={handleSaveEdit}
                            >
                              <SaveIcon fontSize="small" />
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              <CloseIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-100 d-flex justify-content-between align-items-center">
                          <span>{code}</span>
                          {formType != FormTypes.Details && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(index)}
                              >
                                <EditIcon fontSize="small" />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveBarCode(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer p-3 border-t border-gray-200">
                <button className="btn btn-secondary" onClick={handleOpen}>
                  {handleTranslate("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarCodesInput;
