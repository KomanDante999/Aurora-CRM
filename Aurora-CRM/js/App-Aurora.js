import { Table } from "./Table-create.js";
import { DropMenu } from "./Menu.js";
import { logoSvg, iconAddClient, iconSearchBlack, iconBtnClose } from "./icons.js";
import { Connector } from "./Connector.js";
import { Search } from "./Search-form.js";



export class AppAurora {

  _urlServer = 'http://localhost:3000/api/clients'
  _sizeSearchHeader = ''

  constructor(params) {

    this.urlPage = new URL(location)

    if (params.urlServer) this.urlServer = params.urlServer
    else this.urlServer = this._urlServer
    this.sizeSearchHeader = this._sizeSearchHeader

    this.createLayout()
    if (params.container) this.container = params.container
    else this.container = document.body
    this.container.append(this.$header, this.$main, this.$footer)

    // create table
    this.table = new Table({
      container: this.$tableContainer,
      currentSort: 'id',
      urlServer: this.urlServer,
    })

    this.loadTable = new Connector({
      table: this.table,
      urlServer: this.urlServer,
      urlPage: this.urlPage,
    })
    this.loadTable.createLayout()
    this.loadTable.runModalWindow()
    this.loadTable.loadTable()

    // search
    this.headerSearch = new Search({
      table: this.table,
      urlServer: this.urlServer,
    })

    // menu
    this.headerMenu = new DropMenu({
      container: this.$menuContainer,
      trigger: this,
      userClass: 'header-menu',
      listItems: [
        {
          name: 'loadDemo',
          btnText: 'Загрузить демо',
          lable: 'Загрузить демонстрационную базу данных',
          type: 'button',
        },
        {
          name: 'deleteAll',
          btnText: 'Удалить все',
          lable: 'Удалить все записи из базы данных',
          type: 'button',
        },
      ]
    })
    for (const item of this.headerMenu.listSelect) {
      item.$menuBtn.classList.add('btn', 'btn-primary')
      switch (item.name) {
        case 'loadDemo':
          item.$menuBtn.addEventListener('click', () => {
            this.loadDemo = new Connector({
              table: this.table,
              urlServer: this.urlServer,
            })
            this.loadDemo.runModalWindow()
            this.loadDemo.loadDemo()
            this.headerMenu.isActive = false
          })
          break;
          case 'deleteAll':
            item.$menuBtn.addEventListener('click', () => {
              this.deleteAll = new Connector({
                table: this.table,
                urlServer: this.urlServer,
              })
              this.deleteAll.runModalWindow()
              this.deleteAll.startDeleteAll()
              this.headerMenu.isActive = false
            })
            break;
          }
        }

    // button add client
    this.$btnAddClient.addEventListener('click', () => {
      this.createClient = new Connector({
        table: this.table,
        urlServer: this.urlServer,
      })
      this.createClient.runModalWindow()
      this.createClient.startCreateClient()
    })

    // events
    this.widthWindow = document.documentElement.clientWidth
    window.addEventListener('resize', () => {
      this.widthWindow = document.documentElement.clientWidth
    })
  }

  createLayout() {
    this.$header = document.createElement('div')
    this.$headerContainer = document.createElement('div')
    this.$headerLogo = document.createElement('div')
    this.$searchContainer = document.createElement('div')
    this.$menuContainer = document.createElement('div')
    this.$main = document.createElement('div')
    this.$mainContainer = document.createElement('div')
    this.$mainTitle = document.createElement('h1')
    this.$mainSubtitle = document.createElement('h2')
    this.$tableContainer = document.createElement('div')
    this.$footer = document.createElement('div')
    this.$footerContainer = document.createElement('div')
    this.$btnAddClient = document.createElement('button')
    this.$btnAddClientIcon = document.createElement('span')
    this.$btnAddClientCaption = document.createElement('span')

    this.$header.classList.add('header')
    this.$headerContainer.classList.add('header__container', 'container')
    this.$headerLogo.classList.add('header__logo')
    this.$headerLogo.innerHTML = logoSvg
    this.$searchContainer.classList.add('header__search')
    this.$menuContainer.classList.add('header__menu')

    this.$main.classList.add('main')
    this.$mainContainer.classList.add('main__container', 'container')
    this.$mainTitle.classList.add('main__title', 'visually-hidden')
    this.$mainTitle.textContent = 'Аврора CRM- автоматизированная система управление взаимоотношениями с клиентами'
    this.$mainSubtitle.classList.add('main__subtitle')
    this.$mainSubtitle.textContent = 'Клиенты'
    this.$tableContainer.classList.add('main__table')
    this.$footer.classList.add('footer')
    this.$footerContainer.classList.add('footer__container', 'container')
    this.$btnAddClient.classList.add('footer__btn', 'btn-addclient', 'btn', 'btn-secondary')
    this.$btnAddClientIcon.classList.add('btn-addclient__icon')
    this.$btnAddClientIcon.innerHTML = iconAddClient
    this.$btnAddClientCaption.classList.add('btn-addclient__caption')
    this.$btnAddClientCaption.textContent = 'Добавить клиента'

    this.$headerContainer.append(this.$headerLogo, this.$searchContainer, this.$menuContainer)
    this.$header.append(this.$headerContainer)
    this.$mainContainer.append(this.$mainTitle, this.$mainSubtitle, this.$tableContainer)
    this.$main.append(this.$mainContainer)
    this.$btnAddClient.append(this.$btnAddClientIcon, this.$btnAddClientCaption)
    this.$footerContainer.append(this.$btnAddClient)
    this.$footer.append(this.$footerContainer)
  }

  xlSearchHeader() {
    this.$searchContainer.innerHTML = ''
    this.$searchContainer.append(this.headerSearch.$box)
    this.sizeSearchHeader = 'xl'
  }
  smSearchHeader() {
    this.$searchContainer.innerHTML = ''
    this.$searchWrap = document.createElement('div')
    this.$searchBtnOpen = document.createElement('button')
    this.$searchBtnClose = document.createElement('button')
    this.$searchWrap.classList.add('header__search-wrap', 'is-hidden')
    this.$searchBtnOpen.classList.add('header__search-open')
    this.$searchBtnClose.classList.add('header__search-close')
    this.$searchBtnOpen.innerHTML = iconSearchBlack
    this.$searchBtnClose.innerHTML = iconBtnClose

    this.$searchWrap.append(this.headerSearch.$box, this.$searchBtnClose)
    this.$searchContainer.append(this.$searchBtnOpen, this.$searchWrap)

    this.$searchBtnOpen.addEventListener('click', () => {
      this.$searchBtnOpen.classList.add('is-hidden')
      this.$searchWrap.classList.remove('is-hidden')
    })
    this.$searchBtnClose.addEventListener('click', () => {
      this.$searchBtnOpen.classList.remove('is-hidden')
      this.$searchWrap.classList.add('is-hidden')
    })
    this.sizeSearchHeader = 'sm'
  }

  get sizeSearchHeader() {
    return this._sizeSearchHeader
  }
  set sizeSearchHeader(value) {
    this._sizeSearchHeader = value
  }


  get widthWindow() {
    return this._widthWindow
  }
  set widthWindow(value) {
    this._widthWindow = value
    // menu
    if (this.headerMenu) {
      if (value > 840 && this.headerMenu.sizeBtnHeader !== 'xl') {
        this.headerMenu.xlBtnContant('Меню')
        this.headerMenu.$btnHeader.classList.add('btn', 'btn-secondary')
      }
      if (value <= 840 && this.headerMenu.sizeBtnHeader !== 'sm') {
        this.headerMenu.smBtnContant('lines')
        this.headerMenu.$btnHeader.classList.remove('btn', 'btn-secondary')
      }
    }
    // search form
    if (this.headerSearch) {
      if (value > 425 && this.sizeSearchHeader !=- 'xl') this.xlSearchHeader()

      if (value <= 425 && this.sizeSearchHeader !== 'sm') this.smSearchHeader()


    }
  }


};

