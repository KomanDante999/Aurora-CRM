import { iconArrowDown, iconVk, iconFb, iconPhone, iconEmail, iconOther, iconBtnEdit, iconBtnCancel , iconLoadSmall } from "./icons.js";
import { ListClients } from "./List-clients.js";
import { Toollee } from "../library/toollee/toollee.min.js";
import { Connector } from "./Connector.js";


// создание таблицы ============================================
export class Table {
  _currentSort = ''
  _sortDirect = true

  constructor(params) {
    // data
    this.headCells = []
    this.bodyRows = []
    this.currentSort = params.currentSort
    this.sortDirect = this._sortDirect
    this.disableNodes = []
    if (params.disableNodes) this.disableNodes = params.disableNodes

    // layout--------
    this.layout = new Layout({
      container: params.container,
    })
    this.headCells = this.layout.headSortedCells

    // events--------
    this.layout.$table.addEventListener('keydown', (event) => {   // keybord
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        this.keybordEvent = event.key
      }
    })

    for (const cell of this.headCells) {            // sort
      cell.$cell.addEventListener('click', () => {

        if (this.currentSort !== cell.name) {
          this.currentSort = cell.name
          this.sortDirect = true
        } else this.sortDirect = cell.sortDirect

      })
    }

  }

  dataParsed(incomData) {
    this.dataClient = new ListClients({
      dataTable: incomData,
      currentSort: this.currentSort,
    })
  }

  renderTableBody() {
    this.layout.$body.innerHTML = ''
    if (this.dataClient.arrayClients.length > 0) {
      for (const client of this.dataClient.arrayClients) {
        this.bodyRow = new BodyRow(client)
        this.layout.$body.append(this.bodyRow.$row)
        this.bodyRows.push(this.bodyRow)
      }
    }
    // event change
    for (const row of this.bodyRows) {
      row.$buttonChange.addEventListener('click', () => {
        this.changeClient(row.id, row.fullName)
      });
    }
    // event delete
    for (const row of this.bodyRows) {
      row.$buttonDelete.addEventListener('click', () => {
        this.deleteClient(row.id, row.fullName)
      });
    }
  }

  changeClient(id, fullName) {
    this.loadClient = new Connector({
      table: this,
    })
    this.loadClient.createLayout()
    this.loadClient.runModalWindow()
    this.loadClient.loadClient(id, fullName)
  }

  deleteClient(id, fullName) {
    this.delClient = new Connector({
      table: this,
    })
    this.delClient.createLayout()
    this.delClient.runModalWindow()
    this.delClient.startDeleteClient(id, fullName)
  }

  focusedRow(idClient) {

    for (const row of this.bodyRows) {
      if (row.id === idClient) {
        row.$row.focus()
      }
    }
  }

  get currentSort() {return this._currentSort}

  set currentSort(value) {
    this._currentSort = value
    for (const cell of this.headCells) {
      if (cell.name == value) cell.sortActive = true
      else cell.sortActive = false
    }
    if (this.dataClient) {
      this.dataClient.sortKey = value
      this.dataClient.sortDir = this.sortDirect
      this.renderTableBody()
    }
  }

  get sortDirect() {
    return this._sortDirect
  }
  set sortDirect(value) {
    this._sortDirect = value
    if (this.dataClient) {
      this.dataClient.sortDir = value
      this.renderTableBody()
    }
  }

  get keybordEvent() {
    return this._keybordEvent
  }
  set keybordEvent(value) {
    this._keybordEvent = value
    for (const row of this.bodyRows) {
      if (row.isFocuse) {
        this.index = this.bodyRows.indexOf(row)
        if (value === 'ArrowUp') {
          this.index = this.index - 1
          if (this.index < 0) this.index = this.bodyRows.length - 1
        }
        if (value === 'ArrowDown') {
          this.index = this.index + 1
          if (this.index > this.bodyRows.length - 1) this.index = 0
        }
        this.bodyRows[this.index].$row.focus()
        return
      }
    }
  }

};

// layout-----------------
class Layout {

  constructor(params) {
    this.headSortedCells = []

    this.$table = document.createElement('div')
    this.$body = document.createElement('div')
    this.$headRow = document.createElement('div')
    this.$infoBox = document.createElement('div')

    this.$table.classList.add('table')
    this.$headRow.classList.add('table__row', 'table__row_head')
    this.$body.classList.add('table__body')
    this.$infoBox.classList.add('table__info-box')

    // head
    this.headCellId = new HeadCell({
      name: 'id',
      title: 'ID',
      sortable: true,
      container: this.$headRow,
    })
    this.headCellId.sortActive = true

    this.headCellName = new HeadCell({
      name: 'fullName',
      title: 'Фамилия Имя Отчество',
      sortable: true,
      iconOther:
        {
          contant: 'Я-А',
          contantRev: 'А-Я',
          class: 'table__icon-other',
        },
      container: this.$headRow,
    })
    this.headCellCreate = new HeadCell({
      name: 'dateCreation',
      title: 'Дата и время создания',
      sortable: true,
      container: this.$headRow,
    })
    this.headCellUpdate = new HeadCell({
      name: 'dateUpdate',
      title: 'Последние изменения',
      sortable: true,
      container: this.$headRow,
    })
    this.headCellContacts = new HeadCell({
      name: 'contacts',
      title: 'Контакты',
      container: this.$headRow,
    })
    this.headCellActions = new HeadCell({
      name: 'actions',
      title: 'Действия',
      container: this.$headRow,
    })

    this.headSortedCells.push(this.headCellId, this.headCellName, this.headCellCreate, this.headCellUpdate)
    this.$table.append(this.$headRow, this.$body)
    if (params.container) params.container.append(this.$table, this.$infoBox)
  }
};


// create head cell ===========================
class HeadCell {

  constructor(params) {
    // data
    this.name = params.name
    this.sortable = false
    if (params.sortable) this.sortable = params.sortable

    if (this.sortable) this.$cell = document.createElement('button')
    else this.$cell = document.createElement('div')

    this.$cell.classList.add('table__cell', 'table__cell_head')
    this.title = params.title.split(' ')
    for (const word of this.title) {
      this.$word = document.createElement('span')
      this.$word.classList.add('table__title-word')
      this.$word.textContent = word
      this.$cell.append(this.$word)
    }

    // create icon
    if (this.sortable) {
      this.$cell.classList.add('sortable')
      this.$icon = document.createElement('span')
      this.$icon.classList.add('table__icon-sort')
      this.$icon.innerHTML = iconArrowDown
      this.$cell.append(this.$icon)

      if (params.iconOther) {
        this.$iconOther = document.createElement('span')
        this.iconOtherCont = params.iconOther.contant
        this.iconOtherContRev = params.iconOther.contantRev
        // this.$iconOther.innerHTML = this.iconOtherCont
        this.$iconOther.classList.add(params.iconOther.class)
        this.$cell.append(this.$iconOther )
      }
      this.sortDirect = false
      this.sortActive = false

      this.$cell.addEventListener('click', () => {
        this.sortDirect = !this.sortDirect
      })
    }

    if (params.container) params.container.append(this.$cell)
  }

  get sortDirect() {return this._sortDirect}

  set sortDirect(value) {
    this._sortDirect = value

    if (this.$icon) {
      if (value) this.$icon.classList.add('sort-up')
      else this.$icon.classList.remove('sort-up')
    }
    if (this.$iconOther) {
      if (value) this.$iconOther.innerHTML = this.iconOtherContRev
      else this.$iconOther.innerHTML = this.iconOtherCont
    }
  }

  get sortActive() {return this._sortActive}

  set sortActive(value) {
    this._sortActive = value
    if (value) {
      this.$cell.classList.add('is-sorted')
      this.sortDirect = true
    } else {
      this.$cell.classList.remove('is-sorted')
      this.sortDirect = false
    }
  }
};

// create table body row ===========================

class BodyRow {
  _visibleContactIcon = 4
  _isFocuse = false

  constructor(dataClient) {
    this.id = dataClient.id
    this.fullName = dataClient.fullName
    // this.arrayCells = []

    this.$row = document.createElement('div')

    this.$cellId = document.createElement('div')
    this.$cellName = document.createElement('div')
    this.$cellCreate = document.createElement('div')
    this.$cellUpdate = document.createElement('div')
    this.$cellContacts = document.createElement('div')
    this.$cellActions = document.createElement('div')

    this.$row.classList.add('table__row', 'table__row_body')
    this.$cellId.classList.add('table__cell', 'table__cell_body', 'table__cell_id')
    this.$cellName.classList.add('table__cell', 'table__cell_body', 'table__cell_name')
    this.$cellCreate.classList.add('table__cell', 'table__cell_body', 'table__cell_create')
    this.$cellUpdate.classList.add('table__cell', 'table__cell_body', 'table__cell_update')
    this.$cellContacts.classList.add('table__cell', 'table__cell_body', 'table__cell_contacts')
    this.$cellActions.classList.add('table__cell', 'table__cell_body', 'table__cell_actions')
    this.$row.tabIndex = '0'

    // id cell
    // this.$cellId.textContent = dataClient.id
    this.creatIdCell(dataClient.id)

    this.$cellName.textContent = dataClient.fullName
    this.$cellCreate.textContent = dataClient.dateToStr(dataClient.dateCreation)
    this.$cellUpdate.textContent = dataClient.dateToStr(dataClient.dateUpdate)

    // contact cell
    if (dataClient.contacts.length > 0) {
      this.createContactlist(this.$cellContacts, dataClient.contacts)
    }

    // actions cell
    this.$wrap = document.createElement('div')
    this.$buttonChange = document.createElement('button')
    this.$buttonDelete = document.createElement('button')
    this.$iconChange = document.createElement('span')
    this.$iconDelete = document.createElement('span')
    this.$iconChangeActive = document.createElement('span')
    this.$iconDeleteActive = document.createElement('span')
    this.$textChange = document.createElement('span')
    this.$textDelete = document.createElement('span')

    this.$wrap.classList.add('table__wrap-buttons')
    this.$buttonChange.classList.add('table__button', 'table__button-change')
    this.$buttonDelete.classList.add('table__button', 'table__button-delete')
    this.$iconChange.classList.add('table__button-icon', 'table__button-icon_change')
    this.$iconDelete.classList.add('table__button-icon', 'table__button-icon_delete')
    this.$iconChangeActive.classList.add('table__button-icon_active')
    this.$iconDeleteActive.classList.add('table__button-icon_active')
    this.$textChange.classList.add('table__text-change')
    this.$textDelete.classList.add('table__text-delete')

    this.$iconChange.innerHTML = iconBtnEdit
    this.$iconDelete.innerHTML = iconBtnCancel
    this.$iconChangeActive.innerHTML = iconLoadSmall
    this.$iconDeleteActive.innerHTML = iconLoadSmall
    this.$textChange.innerHTML = 'Изменить'
    this.$textDelete.innerHTML = 'Удалить'


    this.$iconChange.append(this.$iconChangeActive)
    this.$iconDelete.append(this.$iconDeleteActive)
    this.$buttonChange.append(this.$iconChange, this.$textChange)
    this.$buttonDelete.append(this.$iconDelete, this.$textDelete)

    this.$wrap.append(this.$buttonChange, this.$buttonDelete)
    this.$cellActions.append(this.$wrap)

    this.$row.append(this.$cellId, this.$cellName, this.$cellCreate, this.$cellUpdate, this.$cellContacts, this.$cellActions)

    // events
    this.isFocuse = this._isFocuse

    this.$row.addEventListener('focusin', () => {
      if (!this.isFocuse) this.isFocuse = true
    })
    this.$row.addEventListener('focusout', () => {
      if (this.isFocuse) this.isFocuse = false
    })
  }

  creatIdCell(id) {
    this.$btnId = document.createElement('button')
    this.$btnId.classList.add('table__button', 'table__button-id')
    this.$btnId.innerHTML = `<span>${id.substr(0, 6)}</span><span>${id.substr(6, id.length)}</span>`
    this.$cellId.append(this.$btnId)
    new Toollee({
      target: this.$btnId,
      content: `Двойной клик: скопировать адрес карточки клиента`,
      setUser: {                         // tooltip set: if there are none the default settings will be applied
        theme: 'black',                  // tooltip desing theme default: 'black', 'white', 'blue' (default 'black')
        // blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
        // userClass: 'user-toollee',       // custom class name for elements of tooltip (default none)
        position: 'right',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
        // offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
        margin: 1,                    // indent between the target element and the tooltip  (default 6px)
        arrowWidth: 20,                  // arrow width (default 15px)
        arrowHeight: 25,                 // arrow height (default 10px)
        // removeOnClickOut: false,          // (if blocking = true) remove tooltipe if you click outside the tooltip (default true)
      }
    })

    this.$btnId.addEventListener('dblclick', () => {
      navigator.clipboard.writeText(location.href + '#' + id)
      // .then(() => {
      //   console.log('скопировал');
      // })
      // .catch(err => {
      //   console.log('Something went wrong', err);
      // });
    })

  }

  createContactlist(container, array) {
    container.innerHTML = ''
    this.hiddenCells = array.length - this._visibleContactIcon
    if (this.hiddenCells > 1) {
      this.listContacts = new CellContact(container, array.slice(0, this._visibleContactIcon))
      this.btnUnwrap = document.createElement('button')
      this.btnUnwrap.classList.add('btn-unwrap')
      this.btnUnwrap.textContent = `+${this.hiddenCells}`
      new Toollee({
        target: this.btnUnwrap,
        content: `Показать +${this.hiddenCells} контактов`,
        setUser: {                         // tooltip set: if there are none the default settings will be applied
          theme: 'black',                  // tooltip desing theme default: 'black', 'white', 'blue' (default 'black')
          blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
          // userClass: 'user-toollee',       // custom class name for elements of tooltip (default none)
          // position: 'bottom',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
          // offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
          // margin: 6,                    // indent between the target element and the tooltip  (default 6px)
          // arrowWidth: 10,                  // arrow width (default 15px)
          // arrowHeight: 30,                 // arrow height (default 10px)
          // removeOnClickOut: false,          // (if blocking = true) remove tooltipe if you click outside the tooltip (default true)
        }
      })
      this.listContacts.list.append(this.btnUnwrap)

      this.btnUnwrap.addEventListener('click', () => {
        container.innerHTML = ''
        this.listContacts = new CellContact(container, array)
      })
    } else new CellContact(container, array)
  }

  get isFocuse() {
    return this._isFocuse
  }
  set isFocuse(value) {
    this._isFocuse = value
  }
};

class CellContact {

  constructor(container, contacts) {
    this.list = document.createElement('ul')

    for (const contact of contacts) {

      this.item = document.createElement('li')
      this.link = document.createElement('button')
      this.tooltip = document.createElement('span')
      this.tooltipType = document.createElement('span')
      this.tooltipValue = document.createElement('span')

      container.classList.add('cell-contact')
      this.list.classList.add('cell-contact__list')
      this.item.classList.add('cell-contact__item')
      this.link.classList.add('cell-contact__link')
      this.tooltip.classList.add('tooltip-contact__wrap')
      this.tooltipType.classList.add('tooltip-contact__type')
      this.tooltipValue.classList.add('tooltip-contact__value')

      switch (contact.type) {
        case 'Телефон':
          this.link.innerHTML = iconPhone
          break;
        case 'Доп. телефон':
          this.link.innerHTML = iconPhone
          break;
        case 'Email':
          this.link.innerHTML = iconEmail
          break;
        case 'Vk':
          this.link.innerHTML = iconVk
          break;
        case 'Facebook':
          this.link.innerHTML = iconFb
          break;
          default:
          this.link.innerHTML = iconOther
          break;
      }

      this.tooltipType.textContent = `${contact.type}:`
      this.tooltipValue.textContent = contact.value
      this.tooltip.append(this.tooltipType, this.tooltipValue)
      this.item.append(this.link)
      this.list.append(this.item)

      new Toollee({
        target: this.link,
        content: this.tooltip,
        setUser: {                         // tooltip set: if there are none the default settings will be applied
          theme: 'black',                  // tooltip desing theme default: 'black', 'white', 'blue' (default 'black')
          blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
          // userClass: 'user-toollee',       // custom class name for elements of tooltip (default none)
          // position: 'bottom',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
          // offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
          // margin: 6,                    // indent between the target element and the tooltip  (default 6px)
          // arrowWidth: 10,                  // arrow width (default 15px)
          // arrowHeight: 30,                 // arrow height (default 10px)
          // removeOnClickOut: false,          // (if blocking = true) remove tooltipe if you click outside the tooltip (default true)
        }
      })
    }
    container.append(this.list)
  }
}






