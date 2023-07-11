import { Toollee } from "../library/toollee/toollee.min.js";
import { Choosse } from "../library/choosse/Choosse.min.js";
import { iconContactDelete, iconLoadBig } from "./icons.js";
import { Validator } from "./Validation.js";
import { DropMenu } from "./Menu.js";
import { ApiCrmServer } from "./API-crm-server.js";

/*
new InputForm({
  parent: node,
  typeForm: 'add',        // 'add', 'change'
  btnCloseModal: none,    // button for close modal window (belongin to the modal window)
  clientData: {
    surname: '',
    name: '',
    lastName: '',
    contacts: [
      {
        type: 'Телефон',
        value: '+71234567890'
      },
      {
        type: 'Email',
        value: 'abc@xyz.com'
      },
      {
        type: 'Facebook',
        value: 'https://facebook.com/vasiliy-pupkin-the-best'
      }
    ],
  }
})
*/
export class InputForm {

  _clientData = {
  }
  _formValid = true
  _validationForm = true      // true - валидация включена
  _validAutoCorrect = true    // true - при валидации полей будет происходить автозамена и автоудаление неверных символов (если возможно), false - будет выводиться ошибка
  _validLang = 'rus'       // выбор языка валидации
  _urlServer = 'http://localhost:3000/api/clients'

  constructor(params) {
    //_______layout
    this.$box = document.createElement('div')
    // header
    this.$header = document.createElement('div')
    this.$menuContainer = document.createElement('div')
    this.$title = document.createElement('h2')
    // main
    this.$form = document.createElement('form')
    this.$sectionPerson = document.createElement('div')
    this.$sectionContacts = document.createElement('div')
    this.$containerContacts = document.createElement('div')
    this.$btnAddContact = document.createElement('button')
    this.$btnAddContactText = document.createElement('span')
    this.$btnAddContactIcon = document.createElement('span')
    // service
    this.$sectionService = document.createElement('div')
    this.$btnSubmit = document.createElement('button')
    this.$btnSubmitIcon = document.createElement('span')
    this.$btnSubmitContent = document.createElement('span')

    //_______settings
    this.clientData = this._clientData
    this.inputs = []
    this.contacts = []
    if (params.clientData) this.clientData = params.clientData
    this.typeForm = params.typeForm
    if (params.connector) this.connector = params.connector

    this.$box.classList.add('input-form')

    // header----------------------------------------
    this.$header.classList.add('input-form__header')
    this.$menuContainer.classList.add('input-form__menu')
    this.$title.classList.add('input-form__title')
    this.$header.append(this.$menuContainer, this.$title)

    // menu
    this.menu = new DropMenu({
      container: this.$menuContainer,
      trigger: this,
      userClass: 'input-menu',
      listItems: [
        {
          name: 'validationForm',
          value: this.validationForm,
          lable: 'Проверка формы ввода',
          type: 'radio',
        },
        {
          name: 'validAutoCorrect',
          value: this.validAutoCorrect,
          lable: 'Автоисправление при проверке',
          type: 'radio',
        },
        {
          name: 'validLang',
          value: this.validLang,
          lable: 'Язык проверки',
          type: 'select',
          castomClass: 'input-choosse',
          hideCurrentSelect: true,
          list: [
            {
              name: 'Русский',
              value: 'rus',
            },
            {
              name: 'English',
              value: 'eng',
            },
            {
              name: 'Français',
              value: 'fra',
            },
            {
              name: 'Deutsch',
              value: 'deu',
            },
            {
              name: 'Español',
              value: 'esp',
            },
          ]
        },
      ]
    })
    this.menu.smBtnContant('lines')
    for (const item of this.menu.listSelect) {
      this[item.name] = item.value
    }

    new Toollee({
      target: this.menu.$btnHeader,
      content: `Настройки валидации`,
      setUser: {                         // tooltip set: if there are none the default settings will be applied
        theme: 'violet',                  // tooltip desing theme default: 'black', 'white', 'blue' (default 'black')
        // blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
        // userClass: 'user-toollee',       // custom class name for elements of tooltip (default none)
        // position: 'bottom',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
        // offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
        // margin: 6,                    // indent between the target element and the tooltip  (default 6px)
        arrowWidth: 20,                  // arrow width (default 15px)
        arrowHeight: 30,                 // arrow height (default 10px)
        // removeOnClickOut: false,          // (if blocking = true) remove tooltipe if you click outside the tooltip (default true)
      }
  })

    switch (this.typeForm) {
      case 'add':
        this.$title.textContent = 'Новый клиент'
        break;
      case 'change':
        this.$title.textContent = 'Изменить данные'
        this.$titleId = document.createElement('p')
        this.$titleId.classList.add('input-form__title-id')
        this.$titleId.textContent = `ID: ${this.clientData.id}`
        this.$header.append(this.$titleId)
        break;
      }
      this.$box.append(this.$header)

    // main---------------------------------------
      this.$form.classList.add('input-form__form')
      this.$form.noValidate = true

      // personal data
      this.$sectionPerson.classList.add('input-form__section', 'input-form__section_person')

      for (const inputParrent of personalParrent) {
        this.inputPersonal = new CreateInputPers({
          container: this.$sectionPerson,
          parent: inputParrent,
          inputData: this.clientData,
        })
        this.inputs.push(this.inputPersonal)
      }

      this.$form.append(this.$sectionPerson)

      // contacts data
      this.$sectionContacts.classList.add('input-form__section', 'input-form__section_contacts')
      this.$containerContacts.classList.add('input-form__container-contacts')

      if (this.typeForm == 'change') {
        // list contacts create
        if (this.clientData.contacts.length > 0) {
          for (const contact of this.clientData.contacts) {
            this.createContactList({
              type: contact.type,
              value: contact.value,
            })
          }
        }
      }

      this.$btnAddContact.classList.add('input-form__btn-addcontact')
      this.$btnAddContactIcon.classList.add('input-form__add-icon')
      this.$btnAddContactText.classList.add('input-form__add-text')
      this.$btnAddContact.type = 'button'
      this.$btnAddContactText.textContent = 'Добавить контакт'

      this.$btnAddContact.append(this.$btnAddContactIcon, this.$btnAddContactText)

      this.checkContainContacts()
      this.validAutoCorrect = this._validAutoCorrect
      this.$btnAddContact.addEventListener('click', () => {
        if (this.$containerContacts.childNodes.length < 10) {
          this.createContactList({
            type: '',
            value: '',
          })
        }
      })

      this.$sectionContacts.append(this.$containerContacts, this.$btnAddContact)
      this.$form.append(this.$sectionContacts)
      this.$box.append(this.$form)

    // service-----------------------------------------------------
    this.$sectionService.classList.add('input-form__section', 'input-form__section-service')
    this.$btnSubmit.classList.add('input-form__submit-btn', 'btn', 'btn-primary')
    this.$btnSubmit.type = 'submit'
    this.$btnSubmitIcon.classList.add('input-form__submit-icon')
    this.$btnSubmitContent.classList.add('input-form__submit-content')

    this.$btnSubmitContent.textContent = 'Сохранить'

    this.$btnSubmit.append(this.$btnSubmitIcon, this.$btnSubmitContent)
    this.$sectionService.append(this.$btnSubmit)
    this.$form.append(this.$sectionService)
    if (params.container) params.container.append(this.$box)

    // events
    this.formValid = this._formValid

    for (const input of this.inputs) {
      input.$input.addEventListener('input', () => {
        this.formValid = true
      })
    }
    for (const contact of this.contacts) {
      contact.$input.addEventListener('input', () => {
        this.formValid = true
      })
    }

    //submit
    this.$form.addEventListener('submit', async e => {
      e.preventDefault()
      await this.submitForm()
    })
  }

  createContactList(params) {
    this.contactGoup =  new InputContact({
      container: this.$containerContacts,
      validAutoCorrect: this.validAutoCorrect,
      contacts: [
        {
          type: params.type,
          value: params.value,
        }
      ],
      })
    this.checkContainContacts()
    this.contactGoup.$btnDelete.addEventListener('click', () => {
      this.checkContainContacts()
      this.contactsUpdate()
    })
    this.contacts.push(this.contactGoup)
  }

  async submitForm() {
    if (this.validationForm) {
      this.validationStart()              // validation
    }
    this.checkContainContacts()
    if (this.formValid) {                // is data valid
      this.clientDataUpdate()
      switch (this.typeForm) {
        case 'add':
          this.connector.runCreateClient({
            sendData: this.clientData,
          })
          break;
        case 'change':
          this.connector.runChangeClient({
            sendData: this.clientData,
          })
          break;
      }
    }
  }

  checkContainContacts() {
    if (this.$containerContacts.childNodes.length > 0) {
      this.$sectionContacts.classList.add('is-contains')
      this.$containerContacts.classList.add('is-contains')
    }
    else {
      this.$sectionContacts.classList.remove('is-contains')
      this.$containerContacts.classList.remove('is-contains')
    }
    if (this.$containerContacts.childNodes.length >= 10) this.$btnAddContact.classList.add('visually-hidden')
    else this.$btnAddContact.classList.remove('visually-hidden')
  }

  validationStart() {
    this.formValid = true
    for (const input of this.inputs) {
      input.validation({
        validAutoCorrect: this.validAutoCorrect,
        validLang: this.validLang
      })
    }
    for (const contact of this.contacts) {
      contact.validation({
        validAutoCorrect: this.validAutoCorrect,
        validLang: this.validLang
      })
    }
    if (this.inputs.find(item => item.valid === false) || this.contacts.find(item => item.valid === false))
    this.formValid = false
  }

  clientDataUpdate() {
    for (const item of this.inputs) {
      this.clientData[item.name] = item.value
    }

    this.clientData.contacts = []
    for (const item of this.contacts) {
      this.clientData.contacts.push({
        type: item.inputName,
        value: item.inputValue
      })
    }
  }

  contactsUpdate() {
    this.contacts.splice(this.contacts.findIndex(item => item.delete), 1)
  }

  createInfoBox(params) {
    this.$infoBox = document.createElement('div')
    this.$infoBox.classList.add('input-form__info-box')
    this.$sectionService.prepend(this.$infoBox)

    switch (params.theme) {
      case 'red':
        this.$infoBox.classList.add('theme-red')
        break;
      case 'green':
        this.$infoBox.classList.add('theme-green')
        break;
    }

    this.$infoBox.textContent = params.message
  }

  removeInfoBox() {
    if (this.$infoBox) this.$infoBox.remove()
  }

  get formValid() {
    return this._formValid
  }

  set formValid(value) {
    this._formValid = value
    if (value) this.removeInfoBox()
    else this.createInfoBox({
      theme: 'red',
      message: 'Поля не заполнены или заполнены не верно! Испарвьте ошибки!',
    })
  }

  get validAutoCorrect() {
    return this._validAutoCorrect;
  }

  set validAutoCorrect(value) {
    this._validAutoCorrect = value;
  }

  get validLang() {
    return this._validLang;
  }

  set validLang(value) {
    this._validLang = value;
  }

  get validationForm() {
    return this._validationForm;
  }

  set validationForm(value) {
    this._validationForm = value;
    if (value) {
      for (const item of this.menu.listSelect) {
        if (item.name == 'validAutoCorrect' || item.name == 'validLang') item.disable = false
      }
    } else {
      this.formValid = true
      for (const item of this.menu.listSelect) {
        if (item.name == 'validAutoCorrect' || item.name == 'validLang') item.disable = true
      }
    }
  }
};

let personalParrent = [
  {
    inputName: 'surname',
    lableText: 'Фамилия',
    lableIcon: '*',
    required: true,
  },
  {
    inputName: 'name',
    lableText: 'Имя',
    lableIcon: '*',
    required: true,
  },
  {
    inputName: 'lastName',
    lableText: 'Отчество',
  }
]

// input personal data
class CreateInputPers {
_value = ''
_type = 'text'
_required = false

  constructor(params) {

    this.$inputGroup = document.createElement('div')
    this.$lable = document.createElement('lable')
    this.$message = document.createElement('div')
    this.$input = document.createElement('input')

    this.name = params.parent.inputName
    this.value = this._value
    if (params.inputData) {
      for (let key in params.inputData) {
        if (this.name == key) this.value = params.inputData[key]
      }
    }

    this.type = this._type
    if (params.parent.inputType) this.type = params.parent.inputType
    this.required = this._required
    if (params.parent.required) this.required = params.parent.required

    this.$inputGroup.classList.add('input-form__group-persone')
    this.$lable.classList.add('input-form__lable-persone')
    this.$message.classList.add('input-form__message-persone')
    this.$input.classList.add('input-form__input-persone')
    this.$lableText = document.createElement('span')
    this.$lableIcon = document.createElement('span')
    this.$lableText.classList.add('input-form__lable-text')
    this.$lableIcon.classList.add('input-form__lable-icon')

    this.$input.value = this.value
    this.$input.name = this.name
    this.$input.type = this.type
    this.valid = true

    this.$lableText.textContent = params.parent.lableText
    this.$lableIcon.textContent = params.parent.lableIcon

    this.$input.addEventListener('input', () => {
      this.value = this.$input.value
      this.valid = true
    })
    this.$lable.addEventListener('click', () => {
      this.$input.focus()
    })

    this.$lable.append(this.$lableText, this.$lableIcon)
    this.$inputGroup.append(this.$lable, this.$input, this.$message)
    if (params.container) params.container.append(this.$inputGroup)
  }

  validation(params) {

    this.validator = new Validator({         // checking for empty
      value: this.value,
      metod: 'empty',
      message: 'Поле обязательно к заполнению',
      required: this.required
    })

    this.invalidMessage = this.validator.message
    this.value = this.validator.value
    this.valid = this.validator.valid

    if (this.valid) {
      this.validator = new Validator({        // checking for alfabet
        value: this.value,
        metod: 'alphabet',
        message: 'Недопустимые символы',
        validAutoCorrect: params.validAutoCorrect,
        validLang: params.validLang
      })

      this.invalidMessage = this.validator.message
      this.value = this.validator.value
      this.valid = this.validator.valid
    }

    if (this.valid) {
      this.validator = new Validator({          // checking for apper case
        value: this.value,
        metod: 'apperCase',
        validAutoCorrect: params.validAutoCorrect,
        validLang: params.validLang
      })

      this.value = this.validator.value
      this.valid = this.validator.valid
    }

  }

  set valid(value) {
    this._valid = value
    if (value) {
      this.$input.classList.remove('is-invalid')
      this.$message.classList.remove('is-invalid')
    }
    else {
      this.$input.classList.add('is-invalid')
      this.$message.classList.add('is-invalid')
    }
  }

  get valid() {
    return this._valid;
  }

  set value(value) {
    this._value = value
    this.$input.value = this._value
    if (value) this.$lable.classList.remove('is-empty')
    else this.$lable.classList.add('is-empty')
  }

  get value() {
    return this._value;
  }

  get invalidMessage() {
    return this._invalidMessage;
  }

  set invalidMessage(value) {
    this._invalidMessage = value;
    if (value.length > 0) this.$message.textContent = value
  }

}

// input contact data

class InputContact {
  _delete = false
  _inputValue = ''

  constructor(options) {
    this.delete = this._delete

    this.$inputGroup = document.createElement('div')
    this.$selectContainer = document.createElement('div')
    this.$input = document.createElement('input')
    this.$btnDelete = document.createElement('button')
    this.$message = document.createElement('div')

    this.$inputGroup.classList.add('input-form__group-contact', 'contact-group')
    this.$selectContainer.classList.add('contact-group__select-container')
    this.$input.classList.add('contact-group__input')
    this.$btnDelete.classList.add('contact-group__btn-delete')
    this.$message.classList.add('input-form__message-contact')

    this.choosse = new Choosse({
      container: this.$selectContainer,
      list: [
        {
          name: 'Телефон',
          value: 'tel',
        },
        {
          name: 'Доп. телефон',
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
        {
          name: 'Facebook',
          value: 'url',
        },
      ],
      hideCurrentSelect: true,
      castomClass: 'contact-choosse',
      addItems: true,
    })
    this.choosse.selectedName = 'Телефон'
    if (options.contacts[0].type) {
      this.choosse.selectedName = options.contacts[0].type
    }
    this.inputType = this.choosse.selectedValue
    this.inputName = this.choosse.selectedName

    if (this.inputValue === '') {
      if (options.validAutoCorrect) {
        if (this.inputType === 'tel') this.inputValue = '+7'
        if (this.inputType === 'url') this.inputValue = this.inputName.toLocaleLowerCase() + '.com/'
      }
    }

    for (const select of this.choosse.listSelect) {
      select.$btnSelect.addEventListener('click', () => {
        this.inputType = this.choosse.selectedValue
        this.inputValue = ''
        this.inputName = this.choosse.selectedName
        if (options.validAutoCorrect) {
          if (this.inputType === 'tel') this.inputValue = '+7'
          if (this.inputType === 'url') this.inputValue = this.inputName.toLocaleLowerCase() + '.com/'
        }
      })
    }

    if ('contacts' in options && options.contacts[0].value) this.inputValue = options.contacts[0].value

    // events

    this.valid = true

    this.$input.addEventListener('input', () => {
      this.inputValue = this.$input.value
      this.valid = true
    })

    this.$input.placeholder = 'Введите данные контакта'
    this.$btnDelete.innerHTML = iconContactDelete
    this.$btnDelete.type = 'button'
    new Toollee({
      target: this.$btnDelete,
      content: `Удалить контакт`,
      setUser: {                         // tooltip set: if there are none the default settings will be applied
        theme: 'red1',                  // tooltip desing theme default: 'black', 'white', 'blue' (default 'black')
        // blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
        // userClass: 'contact-toollee',       // custom class name for elements of tooltip (default none)
        // position: 'bottom',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
        // offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
        // margin: 6,                    // indent between the target element and the tooltip  (default 6px)
        // arrowWidth: 10,                  // arrow width (default 15px)
        // arrowHeight: 30,                 // arrow height (default 10px)
        // removeOnClickOut: false,          // (if blocking = true) remove tooltipe if you click outside the tooltip (default true)
      }

    })
    this.$btnDelete.addEventListener('click', () => {
      this.delete = true
    })

    this.$inputGroup.append(this.$selectContainer, this.$input, this.$btnDelete, this.$message)
    options.container?.append(this.$inputGroup)
  }

  validation(params) {
    // this.inputValue = this.$input.value

    if (!this.inputValue) {
      this.delete = true
      return
    }

    this.validator = new Validator({
      value: this.inputValue,
      metod: this.inputType,
      name: this.inputName,
      validAutoCorrect: params.validAutoCorrect,
    })

    this.invalidMessage = this.validator.message
    this.inputValue = this.validator.value
    this.valid = this.validator.valid

  }


  get inputType() {
    return this._inputType
  }

  set inputType(value) {
    this._inputType = value
    if (value) this.$input.type = value
  }

  get inputValue() {
    return this._inputValue
  }

  set inputValue(value) {
    this._inputValue = value
    this.$input.value = value
  }

  get inputName() {
    return this._inputName
  }

  set inputName(value) {
    this._inputName = value
  }

  get delete() {
    return this._delete;
  }

  set delete(value) {
    this._delete = value;
    if (value) this.$inputGroup.remove()
  }

  get valid() {
    return this._valid;
  }

  set valid(value) {
    this._valid = value
    if (value) {
      this.$inputGroup.classList.remove('is-invalid')
      this.$message.classList.remove('is-invalid')
    }
    else {
      this.$inputGroup.classList.add('is-invalid')
      this.$message.classList.add('is-invalid')
    }
  }

  get invalidMessage() {
    return this._invalidMessage;
  }

  set invalidMessage(value) {
    this._invalidMessage = value;
    if (value.length > 0) this.$message.textContent = value
  }

}


