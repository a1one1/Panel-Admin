import React, { Component } from 'react';
export default class LoginA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: new String(),
        };
    }
    onPasswordChange(e) {
        this.setState({
            password: e.target.value,
        });
    }
    render() {
        const { password } = this.state;
        const { login, lengthError, logError } = this.props;

        let renderLoginError, renderLengthError;
        logError
            ? (renderLoginError = (
                <span className="login-error">Введен не правильный пароль</span>
            ))
            : null;

        lengthError
            ? (renderLengthError = (
                <span className="login-error">
                    Пароль должен быть длинее 7 символов
                </span>
            ))
            : null;

        return (
            <div className="login-container">
                <div className="login">
                    <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
                    <div className="uk-margin-top uk-text-lead">Пароль:</div>
                    <input
                        type="password"
                        mame=""
                        id=""
                        className="uk-input uk-margin-top"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => this.onPasswordChange(e)}
                    />
                    {renderLoginError}
                    {renderLengthError}
                    <button
                        className="uk-button uk-button-primary uk-margin-top"
                        type="button"
                        onClick={() => login(password)}
                    >
                        Вход
                    </button>
                </div>
            </div>
        );
    }
}
