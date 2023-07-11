import { Choosse } from "../library/choosse/Choosse.min.js";
import { SwitchBtn } from "../library/switch/Switch.min.js";

/*
new DropMenu({
  container: Node,
  userClass: 'user-class',
  listItems: [
    {
      name: '',                 // name by switch
      value: ,                  // default value by switch
      lable: ''                 // title by switch
      type: 'radio'             // 'radio', 'select'
      list: [             // only by 'select', list items
        {
          name: 'Русский',
          value: 'rus',
        },
        {
          name: 'English',
          value: 'eng',
        }
      ]
    }
  ]
})
*/
export class DropMenu {
  _isActive = false
  _dropMenuDisable = true
  _sizeBtnHeader = ''

  constructor(params) {
    this.userClass = 'user-class'
    if (params.userClass) this.userClass = params.userClass

    // layout
    this.$menu = document.createElement('div')
    this.$btnHeader = document.createElement('button')
    this.$title = document.createElement('span')
    this.$dropMenu = document.createElement('div')
    this.$dropList = document.createElement('ul')

    this.$menu.classList.add('drop-menu', `${this.userClass}`)
    this.$btnHeader.classList.add('drop-menu__btn-header', `${this.userClass}__btn-header`)
    this.$title.classList.add('drop-menu__title', `${this.userClass}__title`)
    this.$dropMenu.classList.add('drop-menu__menu', `${this.userClass}__menu`)
    this.$dropList.classList.add('drop-menu__list', `${this.userClass}__list`)
    this.$btnHeader.type = 'button'

    this.$dropList.tabIndex = '-1'
    this.$btnHeader.append(this.$title)
    this.$dropMenu.append(this.$dropList)
    this.$menu.append(this.$btnHeader, this.$dropMenu)
    if (params.container) params.container.append(this.$menu)

    // data
    this.listSelect = []
    this.dropMenuDisable = this._dropMenuDisable
    this.sizeBtnHeader = this._sizeBtnHeader


    // events
    this.$btnHeader.addEventListener('click', () => {
      this.isActive = !this.isActive
      if (this.isActive) this.dropMenuDisable = false
    })

    this.$dropMenu.addEventListener('animationend', () => {
      if (!this.isActive) this.dropMenuDisable = true
    })

    this.$menu.addEventListener('click', event => {
      event._clickOnMenu = true
    })

    document.body.addEventListener('click', event => {
      if (!event._clickOnMenu && this.isActive) {
        this.isActive = false
      }
    })

    // create contant menu
    if ('listItems' in params) {
      for (const item of params.listItems) {
        this.menuItem = new CreateItem({
          container: this.$dropList,
          trigger: params.trigger,
          userClass : this.userClass,
          options: item,
        })
        this.listSelect.push(this.menuItem)
      }
    }
  }

  xlBtnContant(btnContant) {
    this.$btnHeader.classList.add('drop-menu__btn-header_text', `${this.userClass}__btn-header_text`)
    this.$title.classList.add('drop-menu__title_text', `${this.userClass}__title_text`)
    this.$btnHeader.classList.remove('drop-menu__btn-header_lines', `${this.userClass}__btn-header_lines`)
    this.$title.classList.remove('drop-menu__title_lines', `${this.userClass}__title`)
    this.$title.innerHTML = btnContant
    this.sizeBtnHeader = 'xl'
  }

  smBtnContant(btnType) {
    this.$title.innerHTML = ''
    switch (btnType) {
      case 'lines':
        this.$btnHeader.classList.add('drop-menu__btn-header_lines', `${this.userClass}__btn-header_lines`)
        this.$title.classList.add('drop-menu__title_lines', `${this.userClass}__title`)
        this.$btnHeader.classList.remove('drop-menu__btn-header_text', `${this.userClass}__btn-header_text`)
        this.$title.classList.remove('drop-menu__title_text', `${this.userClass}__title_text`)

        this.$line1 = document.createElement('span')
        this.$line2 = document.createElement('span')
        this.$line3 = document.createElement('span')
        this.$line1.classList.add('drop-menu__line', 'drop-menu__line_1', `${this.userClass}__line`, `${this.userClass}__line_1`)
        this.$line2.classList.add('drop-menu__line', 'drop-menu__line_2', `${this.userClass}__line`, `${this.userClass}__line_2`)
        this.$line3.classList.add('drop-menu__line', 'drop-menu__line_3', `${this.userClass}__line`, `${this.userClass}__line_3`)
        break;
      case 'linesX':
        break;
    }
    this.$title.append(this.$line1, this.$line2, this.$line3)
    this.sizeBtnHeader = 'sm'
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(value) {
    this._isActive = value
    if (value) {
      this.$dropMenu.classList.add('is-open')
      this.$dropMenu.classList.remove('is-close')

    } else {
      this.$dropMenu.classList.remove('is-open')
      this.$dropMenu.classList.add('is-close')
    }
  }

  get dropMenuDisable() {
    return this._dropMenuDisable;
  }

  set dropMenuDisable(value) {
    this._dropMenuDisable = value;
    if (value) this.$dropMenu.classList.add('is-disable')
    else this.$dropMenu.classList.remove('is-disable')
  }

  get sizeBtnHeader() {
    return this._sizeBtnHeader
  }
  set sizeBtnHeader(value) {
    this._sizeBtnHeader = value
  }

};


class CreateItem {
  _disable = false

  constructor(params) {

    this.userClass = 'user-class'
    if (params.userClass) this.userClass = params.userClass

    this.$item = document.createElement('li')
    this.$btnContainer = document.createElement('div')
    this.$lable = document.createElement('div')

    this.$item.classList.add('drop-menu__item', `${this.userClass}__item`)
    this.$btnContainer.classList.add('drop-menu__btn-container', `${this.userClass}__btn-container`)
    this.$lable.classList.add('drop-menu__lable', `${this.userClass}__lable`)
    this.$lable.textContent = params.options.lable

    if (params.trigger) this.trigger = params.trigger

    switch (params.options.type) {
      case 'radio':
        this.switchBtn = new SwitchBtn({
          container:this.$btnContainer,
          options: params.options,
        })
        this.name = this.switchBtn.name
        this.value = this.switchBtn.value
        this.switchBtn.$button.addEventListener('click', () => {
          this.value = this.switchBtn.value
          this.trigger[this.name] = this.value
        })
        break;
        case 'select':
          this.switchBtn = new Choosse({
            container: this.$btnContainer,
            list: params.options.list,
            hideCurrentSelect: params.options.hideCurrentSelect,
            castomClass: params.options.castomClass
          })

          this.name = params.options.name
          this.value = this.switchBtn.selectedValue
          for (const item of this.switchBtn.listSelect) {
            item.$btnSelect.addEventListener('click', () => {
              this.value = this.switchBtn.selectedValue
              this.trigger[this.name] = this.value
            })
          }
          break;
          case 'button':
          this.name = params.options.name
          this.$menuBtn = document.createElement('button')
          this.$menuBtn.classList.add('drop-menu__button', `${this.userClass}__button`)
          this.$menuBtn.textContent = params.options.btnText
          this.$btnContainer.append(this.$menuBtn)
        break;
    }

    //data
    this.disable = this._disable

    this.$item.append(this.$btnContainer, this.$lable)
    if ('container' in params) params.container.append(this.$item)
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get disable() {
    return this._disable;
  }

  set disable(value) {
    this._disable = value;
    if (this.$item) value ? this.$item.classList.add('is-disable') : this.$item.classList.remove('is-disable')
    if (this.switchBtn) this.switchBtn.disable = value
  }

}

