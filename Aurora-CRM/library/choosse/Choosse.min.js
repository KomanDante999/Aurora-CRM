/*
new Choosse({
  container: this.$selectContainer,
  list: [
    {
      name: 'Телефон',
      value: 'tel',
    },
    {
      name: 'Email',
      value: 'email',
    },
    {
      name: 'Vk',
      value: 'url',
    },
  ],
  hideCurrentSelect: true,           //
  castomClass: 'contact=choosse',    // users class
  addItems: true,                    //
  arrow: svg,                        //
  animation: ,                       //
})

Setters selectedName and selectedValue defines the selected default element.
If this setters undefinen - selected default first element in list

users classes:
.user {}
.user__btn-header {}
.user__title {}
.user__icon {}
.user__list {}
.user__item {}
.user__btn-select {}
.user__select-contant {}
*/

export class Choosse {
  _arrow = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.494999 0.69C0.249999 0.935 0.249999 1.33 0.494999 1.575L4.65 5.73C4.845 5.925 5.16 5.925 5.355
  5.73L9.51 1.575C9.755 1.33 9.755 0.935 9.51 0.69C9.265 0.445 8.87 0.445 8.625 0.69L5 4.31L1.375
  0.685001C1.135 0.445001 0.734999 0.445 0.494999 0.69Z" fill="currentColor"/>
  </svg>`
  _isActive = false
  _disable = false

  constructor(params) {
    this.castomClass  = 'user-class'
    if (params.castomClass) this.castomClass = params.castomClass
    // layout
    this.$header = document.createElement('div')
    this.$btnHeader = document.createElement('button')
    this.$title = document.createElement('span')
    this.$icon = document.createElement('span')
    this.$dropList = document.createElement('ul')

    this.$header.classList.add('choosse', `${this.castomClass}`)
    this.$btnHeader.classList.add('choosse__btn-header', `${this.castomClass}__btn-header`)
    this.$title.classList.add('choosse__title', `${this.castomClass}__title`)
    this.$icon.classList.add('choosse__icon', `${this.castomClass}__icon`)
    this.$dropList.classList.add('choosse__list', `${this.castomClass}__list`)
    this.$btnHeader.type = 'button'
    this.$icon.innerHTML = this._arrow
    this.$dropList.tabIndex = '-1'

    this.$btnHeader.append(this.$title, this.$icon)
    this.$header.append(this.$btnHeader, this.$dropList)
    if ('container' in params) params.container.append(this.$header)

    // data
    this.listSelect = []
    this.isActive = this._isActive
    this.disable = this._disable

    // create contant
    for (const item of params.list) {
      this.select = new Select(this.$dropList, item, params.hideCurrentSelect)
      this.select.$box.classList.add('choosse__item', `${this.castomClass}__item`)
      this.select.$btnSelect.classList.add('choosse__btn-select', `${this.castomClass}__btn-select`)
      this.select.$contant.classList.add('choosse__select-contant', `${this.castomClass}__select-contant`)
      this.listSelect.push(this.select)
    }

    this.selectedName = this.listSelect[0].name
    this.selectedValue = this.listSelect[0].value

    for (const select of this.listSelect) {
      select.$btnSelect.addEventListener('click', () => {
        for (const select of this.listSelect) {
          select.selected = false
        }
        select.selected = true
        this.selectedName = select.name
        this.selectedValue = select.value
        this.isActive = !this.isActive
      })
    }

    // events
    this.$btnHeader.addEventListener('click', () => {
      this.isActive = !this.isActive
    })

  }

  get selectedName() {
    return this._selectedName;
  }

  set selectedName(value) {
    this._selectedName = value
    if (value) {
      this.$title.textContent = value
      switch (value) {
        case 'Телефон':
        case 'Доп. телефон':
          this.selectedValue = 'tel'
          break;
        case 'Email':
          this.selectedValue = 'email'
          break;
        case 'Vk':
        case 'Facebook':
          this.selectedValue = 'url'
          break;
          }

      for (const select of this.listSelect) {
        select.selected = false
        if (select.name == value) select.selected = true
      }
    }
  }

  get selectedValue() {
    return this._selectedValue;
  }

  set selectedValue(value) {
    this._selectedValue = value
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value) {
    this._isActive = value
    if (value) {
      this.$dropList.classList.remove('is-hidden')
      this.$icon.classList.add('is-open')
    } else {
      this.$dropList.classList.add('is-hidden')
      this.$icon.classList.remove('is-open')
    }
  }

  get disable() {
    return this._disable;
  }

  set disable(value) {
    this._disable = value;
    if (value) {
      this.$btnHeader.disabled = true
      this.$header.classList.add('is-disable')
      this.$btnHeader.classList.add('is-disable')
    } else {
      this.$btnHeader.disabled = false
      this.$header.classList.remove('is-disable')
      this.$btnHeader.classList.remove('is-disable')
    }
  }
};

class Select {
  _selected = false

  constructor(container, params, hideCurrentSelect) {
    this.selected = this._selected
    this.hideCurrentSelect = hideCurrentSelect
    this.name = params.name
    this.value = params.value
    this.$box = document.createElement('li')
    this.$btnSelect = document.createElement('button')
    this.$btnSelect.type = 'button'
    this.$contant = document.createElement('span')
    this.$contant.innerHTML = this.name

    this.$btnSelect.append(this.$contant)
    this.$box.append(this.$btnSelect)
    container.append(this.$box)
  }

  get selected() {
    return this._selected
  }

  set selected(value) {
    this._selected = value
    if (this.hideCurrentSelect) {
      if (this._selected) {
        this.$box.classList.add('is-hidden')
        this.$btnSelect.tabIndex = '-1'
      }
      else {
        this.$box.classList.remove('is-hidden')
        this.$btnSelect.tabIndex = '0'
      }
    }
  }
}





