import { useState } from "react";


interface ImagePreviewProps {
  src: string;
  height: string | number | undefined;
  width: string | number | undefined;
  alt: string | undefined;
}

const ImagePreview : React.FC<ImagePreviewProps> = ({src,height,width,alt} : ImagePreviewProps) => {

    const [showPreview,setShowPreview]  =  useState<boolean>(false);
    return (
      <>
        <img
          src={src}
          alt={alt}
          height={height}
          width={width}
          className="!w-8 !h-8 aspect-square object-cover"
          onClick={() => setShowPreview(true)}
          style={{ borderRadius: 50 }}
        />

        {showPreview && (
          <div
            className="modal fade show d-block"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1050,
            }}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: "none",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "90%",
              }}
            >
              <div
                className="modal-content"
                style={{
                  background: "transparent",
                  border: "none",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  className="close btn"
                  aria-label="Close"
                  onClick={() => setShowPreview(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                    background: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: "20px" }}>
                    &times;
                  </span>
                </button>
                <div
                  className="modal-body"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={src}
                    alt={alt}
                    style={{
                      maxWidth: "90vw",
                      maxHeight: "90vh",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default ImagePreview