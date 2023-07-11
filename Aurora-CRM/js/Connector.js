import { ModalWindow } from "./Modal-window.js";
import { iconLoadBig } from "./icons.js";
import { InputForm } from "./Input-forms.js";
import { ApiCrmServer } from "./API-crm-server.js";
import { demoDataClients } from "./demo-data-clients.js";



export class Connector {

  _urlServer = 'http://localhost:3000/api/clients'
  _loadTiming = 1000

  constructor(params) {
    if (params.container) this.container = params.container
    if (params.table) this.table = params.table
    if (params.urlPage) this.urlPage = params.urlPage
    else this.urlPage = new URL(location)
  }

  createLayout() {
    this.$box = document.createElement('div')
    this.$title = document.createElement('h2')
    this.$message = document.createElement('div')
    this.$animationBlock = document.createElement('div')
    this.$animationIcon = document.createElement('div')
    this.$btnAction = document.createElement('button')

    this.$box.classList.add('connect-window', `${this.userClass}`)
    this.$title.classList.add('connect-window__title')
    this.$message.classList.add('connect-window__message')
    this.$animationBlock.classList.add('connect-window__animation-block')
    this.$animationIcon.classList.add('connect-window__animation-icon')
    this.$btnAction.classList.add('connect-window__btn-action', 'btn', 'btn-primary')

    this.$animationIcon.innerHTML = iconLoadBig
    this.$animationBlock.append(this.$animationIcon)
    this.$box.append(this.$title, this.$message, this.$animationBlock, this.$btnAction)
  }

  loadTable() {
    this.$title.textContent = 'Загрузка данных таблицы'
    this.$message.textContent = `Данные загружаются с сервера ${this._urlServer}`
    this.$btnAction.textContent = 'Прервать загрузку'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })
    this.animationStart()
    this.resetTheme()

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
        })
        await this.request.get()
        if (this.request.response.ok) {               // success
            this.modalWindow.closeWindow()
            this.table.dataParsed(this.request.getData)
            this.table.renderTableBody()

            if (this.urlPage.hash) {                  // is hash
              this.urlPage.hash.substr(1, this.urlPage.hash.length)
              this.runModalWindow()
              this.loadClient(this.urlPage.hash.substr(1, this.urlPage.hash.length))
            }

        } else {
          this.isError({                         // error
          errorText:`Данные не загружены! Ошибка: ${this.request.statusMessage()}`,
          btnText: 'повторить загрузку',
          })
          this.$btnAction.addEventListener('click', () => {
            this.loadTable()
          })
        }
      } catch (error) {                             //error
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить загрузку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadTable()
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  loadClient(id, fullName) {
    if (!this.urlPage.hash) {
      this.urlPage.hash = id
      window.history.replaceState(null, null, this.urlPage.href)
    }
    this.$title.textContent = 'Загрузка данных клиента'
    this.$message.textContent = `Данные клиента ${fullName} загружаются с сервера ${this._urlServer}`
    this.$btnAction.textContent = 'Прервать загрузку'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
      this.removeHashUrl()
    })
    this.animationStart()
    this.resetTheme()

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
          id: id,
        })
        await this.request.getId()
        if (this.request.response.ok) {               // success
          this.removeConnetor()
          this.inputFormChange = new InputForm({
            typeForm: 'change',
            clientData: this.request.getData,
            container: this.modalWindow.$contant,
            connector: this,
          })
          this.inputFormChange.$btnSubmit.addEventListener('click', () => {
            this.removeHashUrl()
          })

          this.modalWindow.createBtnBottom('Удалить клиента')
          this.modalWindow.$btnBottom.classList.add('delete')
          this.modalWindow.$btnBottom.addEventListener('click', () => {
            this.modalWindow.closeWindow()
            this.table.deleteClient(id, fullName)
            this.removeHashUrl()
          })
          this.modalWindow.$btnCloseTop.addEventListener('click', () => {
            this.removeHashUrl()
          })

        } else {                            // error
          this.isError({
          errorText:`Данные не загружены! Ошибка: ${this.request.statusMessage()}`,
          btnText: 'повторить загрузку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadClient()
        })
        }
      } catch (error) {                           // error
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить загрузку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadClient()
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  runChangeClient(params) {
    this.modalWindow.$contant.innerHTML = ''
    this.createLayout()
    this.modalWindow.$contant.append(this.$box)
    this.$title.textContent = 'Изменить данные'
    this.$message.textContent = `Изменения сохраняются в базу данных`
    this.$btnAction.textContent = 'Прервать сохранение'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
          id: params.sendData.id,
          sendData: params.sendData,
        })
        await this.request.patch()
        if (this.request.response.ok) {             // success
          this.$message.textContent = `Изменения успешно сохранены в базу данных`
          this.$message.classList.add('connect-window__theme_green')
          this.$btnAction.remove()
          setTimeout(() => {
            this.reloadTable()
          }, this._loadTiming);

        } else {
          this.isError({              // error
            errorText:`Данные не сохранены! Ошибка: ${this.request.statusMessage()}`,
            btnText: 'повторить отправку',
          })
          this.$btnAction.addEventListener('click', () => {
            this.runCreateClient({
              sendData: params.sendData,
            })
          })
        }
      } catch (error) {              // error
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить отправку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.runCreateClient({
            sendData: params.sendData,
          })
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)

  }

  startDeleteClient(id, fullName) {
    this.$title.textContent = 'Удалить клиента'
    this.$message.textContent = `Вы действительно хотите удалить клиента ${fullName}?`
    this.$btnAction.textContent = 'Удалить'
    this.animationStop()
    this.resetTheme()
    this.$message.classList.add('connect-window__theme_red')
    this.modalWindow.createBtnBottom('Отмена')
    this.modalWindow.$btnBottom.classList.add('connect-window__btn-modal')
    this.modalWindow.$btnBottom.addEventListener('click', () => {
      this.modalWindow.closeWindow()
    })

    this.$btnAction.addEventListener('click', () => {
      this.runDeleteClient(id, fullName)
    })
  }

  runDeleteClient(id, fullName) {
    this.resetBtnAction()
    this.resetTheme()
    this.$title.textContent = 'Удаление клиента'
    this.$message.textContent = `Клиент ${fullName} удаляется из базы данных`
    this.$btnAction.textContent = 'Прервать удаление'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })
    this.animationStart()

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
          id: id,
        })
        await this.request.delete()
        if (this.request.response.ok) {    // succes
          this.resetTheme()
          this.$title.textContent = 'Удаление клиента'
          this.$message.textContent = `Клиент ${fullName} удален из базы данных`
          this.$message.classList.add('connect-window__theme_green')
          this.$btnAction.remove()
          this.modalWindow.$btnBottom.textContent = 'Закрыть'

          setTimeout(() => {
            this.reloadTable()
          }, this._loadTiming);

        } else this.isError({            // error
          errorText:`Данные не загружены! Ошибка: ${this.request.statusMessage()}`,
          btnText: 'повторить загрузку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadClient()
        })
      } catch (error) {
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить загрузку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadClient()
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  startCreateClient() {
    this.inputFormAdd = new InputForm({
      container: this.modalWindow.$contant,
      typeForm: 'add',
      connector: this,
    })
    this.modalWindow.createBtnBottom('Отмена')
    this.modalWindow.$btnBottom.addEventListener('click', () => {
      this.modalWindow.closeWindow()
    })
  }

  runCreateClient(params) {
    this.modalWindow.$contant.innerHTML = ''
    this.createLayout()
    this.modalWindow.$contant.append(this.$box)
    this.$title.textContent = 'Новый клиент'
    this.$message.textContent = `Данные клиента сохраняются в базу данных`
    this.$btnAction.textContent = 'Прервать сохранение'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
          sendData: params.sendData,
        })
        await this.request.post()
        if (this.request.response.ok) {             // success
          this.$message.textContent = `Клиент успешно добавлен в базу данных`
          this.$message.classList.add('connect-window__theme_green')
          this.$btnAction.remove()
          setTimeout(() => {
            this.reloadTable()
          }, this._loadTiming);

        } else {
          this.isError({              // error
            errorText:`Данные не сохранены! Ошибка: ${this.request.statusMessage()}`,
            btnText: 'повторить отправку',
          })
          this.$btnAction.addEventListener('click', () => {
            this.runCreateClient({
              sendData: params.sendData,
            })
          })
        }
      } catch (error) {              // error
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить отправку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.runCreateClient({
            sendData: params.sendData,
          })
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  loadDemo() {
    this.createLayout()
    this.modalWindow.$contant.append(this.$box)
    this.$title.textContent = 'Загрузка демо'
    this.$message.textContent = `Демонстрационная база данных загружается на сервер ${this._urlServer}`
    this.$btnAction.textContent = 'Прервать загрузку'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })
    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
          sendData: demoDataClients,
        })
        await this.request.post()
        if (this.request.response.ok) {             // success
          this.$message.textContent = `Демонстрационная база данных успешно загружена на сервер`
          this.$message.classList.add('connect-window__theme_green')
          this.$btnAction.remove()
          setTimeout(() => {
            this.reloadTable()
          }, this._loadTiming);

        } else {
          this.isError({              // error
            errorText:`Данные не загружены! Ошибка: ${this.request.statusMessage()}`,
            btnText: 'повторить отправку',
          })
          this.$btnAction.addEventListener('click', () => {
            this.loadDemo()
          })
        }
      } catch (error) {              // error
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить отправку',
        })
        this.$btnAction.addEventListener('click', () => {
          this.loadDemo()
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  startDeleteAll() {
    this.createLayout()
    this.modalWindow.$contant.append(this.$box)
    this.$title.textContent = 'Удалить все'
    this.$message.textContent = `Вы действительно хотите удалить данные всех клиентов?`
    this.$btnAction.textContent = 'Удалить'
    this.animationStop()
    this.resetTheme()
    this.$message.classList.add('connect-window__theme_red')
    this.modalWindow.createBtnBottom('Отмена')
    this.modalWindow.$btnBottom.classList.add('connect-window__btn-modal')
    this.modalWindow.$btnBottom.addEventListener('click', () => {
      this.modalWindow.closeWindow()
    })

    this.$btnAction.addEventListener('click', () => {
      this.runDeleteAll()
    })
  }

  runDeleteAll() {
    this.resetBtnAction()
    this.resetTheme()
    this.$message.textContent = `Данные удаляются из базы данных`
    this.$btnAction.textContent = 'Прервать удаление'
    this.$btnAction.addEventListener('click', () => {
      this.abortConnect()
    })
    this.animationStart()

    setTimeout(async () => {
      try {
        this.request = new ApiCrmServer({
          urlServer: this._urlServer,
        })
        await this.request.get()
        await this.request.deleteAll()

        if (this.request.response.ok) {    // succes
          this.resetTheme()
          this.$message.textContent = `Базы данных очищена`
          this.$message.classList.add('connect-window__theme_green')
          this.$btnAction.remove()
          this.modalWindow.$btnBottom.textContent = 'Закрыть'

          setTimeout(() => {
            this.reloadTable()
          }, this._loadTiming);

        } else this.isError({            // error
          errorText:`Данные не удалены! Ошибка: ${this.request.statusMessage()}`,
          btnText: 'повторить удаление',
        })
        this.$btnAction.addEventListener('click', () => {
          this.runDeleteAll()
        })
      } catch (error) {
        this.isError({
          errorText:`Что-то пошло не так! Ошибка: ${error}`,
          btnText: 'повторить удаление',
        })
        this.$btnAction.addEventListener('click', () => {
          this.runDeleteAll()
        })
      } finally {
        this.animationStop()
      }
    }, this._loadTiming)
  }

  runModalWindow() {
    this.modalWindow = new ModalWindow()
    if (this.$box) this.modalWindow.$contant.append(this.$box)
  }

  reloadTable() {
    this.modalWindow.closeWindow()
    this.loadTable = new Connector({
      table: this.table,
    })
    this.loadTable.createLayout()
    this.loadTable.runModalWindow()
    this.loadTable.loadTable()

  }

  isError(params) {
    this.resetBtnAction()
    this.$message.textContent = params.errorText
    this.$message.classList.remove('connect-window__theme_green')
    this.$message.classList.add('connect-window__theme_red')
    this.$btnAction.textContent = params.btnText
  }

  animationStart() {
    this.$animationBlock.classList.remove('visually-hidden')
  }

  animationStop() {
    this.$animationBlock.classList.add('visually-hidden')
  }

  resetTheme() {
    this.$message.classList.remove('connect-window__theme_red')
    this.$message.classList.remove('connect-window__theme_green')
  }

  resetBtnAction() {
    this.$btnAction.remove()
    this.$btnAction = document.createElement('button')
    this.$btnAction.classList.add('connect-window__btn-action', 'btn', 'btn-primary')
    this.$box.append(this.$btnAction)
  }

  removeConnetor() {
    this.$box.remove()
  }

  abortConnect() {
    this.modalWindow.closeWindow()
  }

  removeHashUrl() {
    if (this.urlPage.hash) {
      this.urlPage.hash = ''
      window.history.replaceState(null, null, this.urlPage.href)
    }

  }
};




