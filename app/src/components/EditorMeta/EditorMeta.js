import React, { Component } from 'react';

export default class EditorMeta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: new String(),
        keywords: new String(),
        description: new String(),
      },
    };
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDOM);
  }

  componentDidUpdate(prevProps) {
    if (this.props.virtualDOM !== prevProps.virtualDOM) {
      this.getMeta(this.props.virtualDOM);
    }
  }

  getMeta(virtualDOM) {
    this.title =
      virtualDOM.head.querySelector('title') ||
      virtualDOM.head.appendChild(virtualDOM.createElement('title'));

    this.keywords = virtualDOM.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDOM.head.appendChild(
        virtualDOM.createElement('meta'),
      );
      this.keywords.setAttribute('name', 'keywords');
      this.keywords.setAttribute('content', new String());
    }

    this.description = virtualDOM.head.querySelector(
      'meta[name="description"]',
    );
    if (!this.description) {
      this.description = virtualDOM.head.appendChild(
        virtualDOM.createElement('meta'),
      );
      this.description.setAttribute('name', 'description');
      this.description.setAttribute('content', new String());
    }

    this.setState({
      meta: {
        title: this.title.innerHTML,
        keywords: this.keywords.getAttribute('content'),
        description: this.description.getAttribute('content'),
      },
    });
  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.keywords.setAttribute('content', this.state.meta.keywords);
    this.description.setAttribute('content', this.state.meta.description);
  }

  onValueChange(e) {
    if (e.target.getAttribute('data-title')) {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          title: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    } else if (e.target.getAttribute('data-key')) {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          keywords: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    } else {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          description: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    }
  }
  render() {
    const { close } = this.props;
    const { title, keywords, description } = this.state.meta;

    return (
      <div className="modal" onClick={() => close()}>
        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
          <h2>Реактирование Meta-тэгов</h2>

          <form>
            <div className="uk-margin">
              <input
                data-title
                className="uk-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>

            <div className="uk-margin">
              <textarea
                data-key
                className="uk-textarea"
                rows="5"
                placeholder="Keywords"
                value={keywords}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>

            <div className="uk-margin">
              <textarea
                data-descr
                className="uk-textarea"
                rows="5"
                placeholder="Description"
                value={description}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
          </form>

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
                {
                  this.applyMeta();
                  close();
                }
              }}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
