import { ApiCrmServer } from "./API-crm-server.js";

export class Search {

  _inputValue = ''
  _getData = []
  constructor(params) {

    this.getData = this._getData
    this.table = params.table
    this.createLayout()
    if (params.container) params.container.append(this.$box)

    this.listItems = []
    this.inputValue = this._inputValue
    this.urlServer = params.urlServer
    this.timerId = null

    // events
    this.$box.addEventListener('keydown', (event) => {        // keybord
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        this.keybordEvent = event.key
      }
    })

    this.$input.addEventListener('input', async () => {      // input
      this.inputValue = this.$input.value.trim()
      if (this.timerId) clearTimeout(this.timerId)
      this.timerId = setTimeout( async () => {
        if (this.$input.value && this.inputValue !== ' ') {
          await this.searchRequest()
          this.createitem()
          this.itemEvent()
        }
      }, 300);
    })

    this.$input.addEventListener('focusin', () => {
      if (!this.isFocuse) this.isFocuse = true
    })
    this.$input.addEventListener('focusout', () => {
      if (this.isFocuse) this.isFocuse = false
    })

    this.$box.addEventListener('click', (event) => {    // close drop list
      event._clickOnsearch = true
    })
    document.body.addEventListener('click', (event) => {
      if (!event._clickOnsearch) {
        this.$list.innerHTML = ''
      }
    })
  }

  createLayout() {
    this.$box = document.createElement('div')
    this.$input = document.createElement('input')
    this.$dropContainer = document.createElement('div')
    this.$list = document.createElement('ul')

    this.$box.classList.add('search')
    this.$input.classList.add('search__input')
    this.$dropContainer.classList.add('search__drop-container')
    this.$list.classList.add('search__drop-list')
    this.$input.placeholder = 'Введите запрос'

    this.$dropContainer.append(this.$list)
    this.$box.append(this.$input, this.$dropContainer)
  }

  async searchRequest() {
    if (this.inputValue.trim()) {
      this.request = new ApiCrmServer({
        urlServer: this.urlServer,
        searchStr: this.inputValue,
      })
      await this.request.search()
      this.getData = null
      this.getData = this.request.getData
    }
  }

  createitem() {
    this.$list.innerHTML = ''
    this.listItems = []
    // if (this.getData.length > 10) this.getData.splice(10)
    for (const client of this.getData) {
      this.item = new Item({
        container: this.$list,
        searchValue: this.inputValue,
        client: client,
      })
      this.listItems.push(this.item)
    }
  }

  itemEvent() {
    for (const item of this.listItems) {
      item.$btn.addEventListener('click', () => {
        this.table.focusedRow(item.id)
        this.$list.innerHTML = ''
      })
    }
  }

  get inputValue() {
    return this._inputValue
  }
  set inputValue(value) {
    this._inputValue = value
    if (!value || value == ' ' ) this.$list.innerHTML = ''
  }

  get getData() {
    return this._getData
  }
  set getData(value) {
    this._getData = value
  }

  get isFocuse() {
    return this._isFocuse
  }
  set isFocuse(value) {
    this._isFocuse = value
    if (value) {
      this.createitem()
      this.itemEvent()
    }
  }

  get keybordEvent() {
    return this._keybordEvent
  }
  set keybordEvent(value) {
    this._keybordEvent = value
    if (value === 'ArrowDown' && this.isFocuse && this.listItems.length > 0) {
      this.listItems[0].$btn.focus()
      return
    } else {
      for (const item of this.listItems) {
        if (item.isFocuse) {
          this.index = this.listItems.indexOf(item)
          if (value === 'ArrowUp') {
            this.index = this.index - 1
          }
          if (value === 'ArrowDown') {
            this.index = this.index + 1
          }
          if (this.index < 0 || this.index > this.listItems.length - 1) this.$input.focus()
          else this.listItems[this.index].$btn.focus()
          return
        }
      }
    }
  }
};

class Item {
  _isFocuse = false

  constructor(params) {

    this.searchValue = params.searchValue
    this.id = params.client.id
    this.name = params.client.name
    this.surname = params.client.surname
    this.lastName = params.client.lastName
    this.contacts = params.client.contacts

    this.layout()
    if (params.container) params.container.append(this.$item)

    this.$btnContant.innerHTML = `${this.surname} ${this.name} ${this.lastName}`
    // events
    this.isFocuse = this._isFocuse

    this.$btn.addEventListener('focusin', () => {
      if (!this.isFocuse) this.isFocuse = true
    })
    this.$btn.addEventListener('focusout', () => {
      if (this.isFocuse) this.isFocuse = false
    })


  }

  layout() {
    this.$item = document.createElement('li')
    this.$btn = document.createElement('button')
    this.$btnContant = document.createElement('span')
    this.$item.classList.add('search__drop-item')
    this.$btn.classList.add('search__drop-button')
    this.$btnContant.classList.add('search__drop-contant')

    this.$btn.append(this.$btnContant)
    this.$item.append(this.$btn)
  }

  get isFocuse() {
    return this._isFocuse
  }
  set isFocuse(value) {
    this._isFocuse = value
  }

};

