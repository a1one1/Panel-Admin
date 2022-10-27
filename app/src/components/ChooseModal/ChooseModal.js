import React from 'react';

const ChooseModal = ({ close, data, redirect }) => {
  return (
    <div className="modal" onClick={() => close()}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <h2>Открыть</h2>
        <ul className="uk-list uk-list-divider">
          {data.length < 1 ? (
            <div>Резервные копии не найдены!</div>
          ) : (
            <React.Fragment>
              {data.map((item) => {
                if (item.time) {
                  return (
                    <li key={item.file}>
                      <a
                        className="uk-link-muted"
                        href="#"
                        onClick={(e) => {
                          redirect(e, item.file);
                          close();
                        }}
                      >
                        Резервная копия от {''}
                        {item.time}
                      </a>
                    </li>
                  );
                } else {
                  return (
                    <li key={item}>
                      <a
                        className="uk-link-muted"
                        href="#"
                        onClick={(e) => {
                          redirect(e, item);
                          close();
                        }}
                      >
                        {item}
                      </a>
                    </li>
                  );
                }
              })}
            </React.Fragment>
          )}
        </ul>
        <div className="modal__buttons">
          <button
            className="uk-button uk-button-text"
            onClick={() => close()}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModal;
