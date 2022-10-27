import React from 'react';

const ConfirmModal = ({ method, close, text }) => {
  const { title, desctiption, button } = text;
  return (
    <div className="modal" onClick={() => close()}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{desctiption}</p>
        <div className="modal__buttons">
          <button
            className="uk-button uk-button-default uk-margin-small-right"
            onClick={() => close()}
          >
            Отменить
          </button>
          <button
            className="uk-button uk-button-primary"
            onClick={() => {
              method();
            }}
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
