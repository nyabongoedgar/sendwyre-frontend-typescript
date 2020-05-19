import React from 'react';

type modalProps = {
    handleClose: () => void;
    show: boolean;
    children: any
}

export const Modal = ({ handleClose, show, children }: modalProps) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          {children}
          <button onClick={handleClose}>close</button>
        </section>
      </div>
    );
  };