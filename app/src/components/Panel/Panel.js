import React from 'react';

const Panel = ({
  fModalOpenPage,
  fModalPublish,
  fModalBackUp,
  fModalMeta,
  fModalLogout,
}) => {
  return (
    <div className="panel">
      <button
        className="uk-button uk-button-text uk-margin-small-right"
        onClick={() => fModalOpenPage()}
      >
        Открыть
      </button>
      <button
        className="uk-button uk-button-text uk-margin-small-right"
        onClick={() => fModalPublish()}
      >
        Опубликовать
      </button>
      <button
        className="uk-button uk-button-text uk-margin-small-right"
        onClick={() => fModalMeta()}
      >
        Редактировать МЕТА
      </button>
      <button
        className="uk-button uk-button-text uk-margin-small-right"
        onClick={() => fModalBackUp()}
      >
        Восстановить
      </button>
      <button
        className="uk-button uk-button-text uk-margin-small-right"
        style={{ color: 'brown' }}
        onClick={() => fModalLogout()}
      >
        Выход
      </button>
    </div>
  );
};

export default Panel;
