import { useEffect } from "react";

export const Modal = ({
  onClose,
  title,
  content,
  onAccept,
  acceptButton = "Accept",
  hasClose = false,
}) => {
  useEffect(() => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("componentModal").style.display = "block";
    document.getElementById("componentModal").className += "show";

    window.addEventListener("click", windowOnClick);
    return () => window.removeEventListener("click", windowOnClick);
  }, []);

  const windowOnClick = (event) => {
    if (event.target.id === "componentModal") {
      closeModal();
      if (onClose) onClose();
    }
  };

  function closeModal() {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("componentModal").style.display = "none";
    document.getElementById(
      "componentModal"
    ).className += document
      .getElementById("componentModal")
      .className.replace("show", "");
  }

  return (
    <>
      <div
        className="modal fade"
        id="componentModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => {
                  closeModal();
                  if (onClose) onClose();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">{content}</div>
            <div className="modal-footer">
              {hasClose && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    closeModal();
                    if (onClose) onClose();
                  }}
                >
                  Deny
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeModal();
                  if (onAccept) onAccept();
                }}
              >
                {acceptButton}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        id="backdrop"
        style={{ display: "none" }}
      ></div>
    </>
  );
};
