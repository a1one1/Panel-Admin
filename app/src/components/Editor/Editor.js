import '../../helpers/IframeLoader.js';
import axios from 'axios';
import React, { Component } from 'react';
import DOMHelper from '../../helpers/Dom-Helper.js';
import EditorText from '../EditorText/EditorText.js';
import Spinner from '../Spinner/Spinner.js';
import ConfirmModal from '../ConfirmModal/ConfirmModal.js';
import ChooseModal from '../ChooseModal/ChooseModal';
import EditorMeta from '../EditorMeta/EditorMeta.js';
import Panel from '../Panel/Panel.js';
import EditorImages from '../EditorImage/EditorImages.js';
import Login from '../LoginA/LoginA.js';
import UIkit from 'uikit';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            modalPublish: false,
            modalOpenPage: false,
            modalBackUp: false,
            modalMeta: false,
            modalLogout: false,
            authification: false,
            loading: true,
            pageList: new Array(),
            backupsList: new Array(),
            newPageName: new String(),
            loginError: false,
            loginLengthError: false,
        };
        this.isLoading = this.isLoading.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.save = this.save.bind(this);
        this.fModalPublish = this.fModalPublish.bind(this);
        this.fModalOpenPage = this.fModalOpenPage.bind(this);
        this.fModalBackUp = this.fModalBackUp.bind(this);
        this.fModalMeta = this.fModalMeta.bind(this);
        this.fModalLogout = this.fModalLogout.bind(this);
        this.restoreBackup = this.restoreBackup.bind(this);
        this.init = this.init.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.checkAuthification();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.authification !== prevState.authification) {
            this.init(null, this.currentPage);
        }
    }

    checkAuthification() {
        axios.get('./api/authification.php').then((responce) => {
            this.setState({
                authification: responce.data.authification,
            });
        });
    }

    login(password) {
        if (password.length > 7) {
            axios.post('./api/login.php', { password: password }).then((responce) => {
                this.setState({
                    authification: responce.data.authification,
                    loginError: !responce.data.authification,
                    loginLengthError: false,
                });
            });
        } else {
            this.setState({
                loginError: false,
                loginLengthError: true,
            });
        }
    }

    logout() {
        axios.get('./api/logout.php').then(() => {
            window.location.replace('/');
        });
    }

    init(e, page) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.authification) {
            this.isLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page, this.isLoaded);
            this.loadPageList();
            this.loadBackupsList();
        }
    }

    open(page, cb) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then((responce) => DOMHelper.parseStringToDOM(responce.data))
            .then((DOM) => DOMHelper.wrapTextNodes(DOM))
            .then((DOM) => DOMHelper.wrapImages(DOM))
            .then((DOM) => {
                this.virtualDOM = DOM;
                return DOM;
            })
            .then((DOM) => DOMHelper.serializeDOMToString(DOM))
            .then((html) => axios.post('./api/saveTempPage.php', { html }))
            .then(() => this.iframe.load('../qwertyytrewq.html'))
            .then(() => this.iframe.load('../qwertyytrewq.html'))
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb);

        this.loadBackupsList();
    }

    async save() {
        this.isLoading();
        const newDom = this.virtualDOM.cloneNode(this.virtualDOM);
        DOMHelper.unwrapTextNode(newDom);
        DOMHelper.unwrapImages(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        await axios
            .post('./api/savePage.php', { pageName: this.currentPage, html })
            .then(() => this.showNotifications('Успешно сохранено', 'success'))
            .catch(() => this.showNotifications('Ошибка сохранения', 'danger'))
            .finally(this.isLoaded());
        this.loadBackupsList();
    }

    enableEditing() {
        this.iframe.contentDocument.body
            .querySelectorAll('text-editor')
            .forEach((element) => {
                const id = element.getAttribute('nodeid');
                const virtualElement = this.virtualDOM.body.querySelector(
                    `[nodeid="${id}"]`,
                );
                new EditorText(element, virtualElement);
            });

        this.iframe.contentDocument.body
            .querySelectorAll('[editableimgid]')
            .forEach((element) => {
                const id = element.getAttribute('editableimgid');
                const virtualElement = this.virtualDOM.body.querySelector(
                    `[editableimgid="${id}"]`,
                );
                new EditorImages(
                    element,
                    virtualElement,
                    this.isLoading,
                    this.isLoaded,
                    this.showNotifications,
                );
            });
    }

    injectStyles() {
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
      text-editor: hover {
        outline: 3px solid orange;
        outline-offset: 8px;
      }
      text-editor: focus {
        outline: 3px solid red;
        outline-offset: 8px;
      }
      [editableimgid]: hover {
        outline: 3px solid orange;
        outline-offset: 8px;
      }
      `;
        this.iframe.contentDocument.head.appendChild(style);
    }

    showNotifications(message, status) {
        UIkit.notification({ message, status });
    }

    loadPageList() {
        axios
            .get('./api/pageList.php')
            .then((responce) =>
                this.setState((prevState) => (prevState.pageList = responce.data)),
            );
    }

    loadBackupsList() {
        axios.get('./backups/backups.json').then((responce) =>
            this.setState(
                (prevState) =>
                (prevState.backupsList = responce.data.filter((backup) => {
                    return backup.page === this.currentPage;
                })),
            ),
        );
    }

    restoreBackup(e, backup) {
        if (e) {
            e.preventDefault();
        }
        UIkit.modal
            .confirm(
                'Вы действительно хотите восстановить страницу из этой резервной копии? Все несохранненые данные будут потеряны!',
                { labels: { ok: 'Восстановить', cancel: 'Отмена' } },
            )
            .then(() => {
                this.isLoading();
                return axios.post('./api/restoreBackup.php', {
                    page: this.currentPage,
                    file: backup,
                });
            })
            .then(() => {
                this.open(this.currentPage, this.isLoaded);
            });
    }

    isLoading() {
        this.setState((prevState) => (prevState.loading = true));
    }

    isLoaded() {
        this.setState((prevState) => (prevState.loading = false));
    }

    fModalPublish() {
        this.setState(
            (prevState) => (prevState.modalPublish = !prevState.modalPublish),
        );
    }

    fModalOpenPage() {
        this.setState(
            (prevState) => (prevState.modalOpenPage = !prevState.modalOpenPage),
        );
    }

    fModalBackUp() {
        this.setState(
            (prevState) => (prevState.modalBackUp = !prevState.modalBackUp),
        );
    }

    fModalMeta() {
        this.setState((prevState) => (prevState.modalMeta = !prevState.modalMeta));
    }

    fModalLogout() {
        this.setState(
            (prevState) => (prevState.modalLogout = !prevState.modalLogout),
        );
    }

    render() {
        const {
            loading,
            modalPublish,
            modalOpenPage,
            modalBackUp,
            modalLogout,
            pageList,
            backupsList,
            modalMeta,
            authification,
            loginError,
            loginLengthError,
        } = this.state;

        if (!authification) {
            return (
                <Login
                    login={this.login}
                    lengthError={loginLengthError}
                    logError={loginError}
                />
            );
        }

        return (
            <React.Fragment>
                <iframe frameBorder="0"></iframe>
                <input
                    id="img-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                ></input>

                {loading ? <Spinner active /> : <Spinner />}
                <Panel
                    fModalOpenPage={this.fModalOpenPage}
                    fModalPublish={this.fModalPublish}
                    fModalBackUp={this.fModalBackUp}
                    fModalMeta={this.fModalMeta}
                    fModalLogout={this.fModalLogout}
                />

                {modalPublish && (
                    <React.Fragment>
                        <ConfirmModal
                            method={this.save}
                            close={this.fModalPublish}
                            text={{
                                title: 'Сохранение',
                                desctiption: 'Вы действительно хотите сохранить изменения?',
                                button: 'Опубликовать',
                            }}
                        />
                    </React.Fragment>
                )}
                {modalLogout && (
                    <React.Fragment>
                        <ConfirmModal
                            method={this.logout}
                            close={this.fModalLogout}
                            text={{
                                title: 'Выход',
                                desctiption: 'Вы действительно хотите выйти?',
                                button: 'Выйти',
                            }}
                        />
                    </React.Fragment>
                )}
                {modalOpenPage && (
                    <React.Fragment>
                        <ChooseModal
                            data={pageList}
                            close={this.fModalOpenPage}
                            redirect={this.init}
                        />
                    </React.Fragment>
                )}
                {modalBackUp && (
                    <React.Fragment>
                        <ChooseModal
                            data={backupsList}
                            close={this.fModalBackUp}
                            redirect={this.restoreBackup}
                        />
                    </React.Fragment>
                )}
                {this.virtualDOM && modalMeta && (
                    <React.Fragment>
                        <EditorMeta close={this.fModalMeta} virtualDOM={this.virtualDOM} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}
