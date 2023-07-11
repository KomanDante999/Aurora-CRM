/*
let validator = new Validator({
  value: '',
  messange: '',            // users messange
  required: true/false,    //
})

Validator return:
validator.value       //true or false
validator.massange    // messange if not valid

Validator metods:
validator.emrty      // checking for emptiness


*/

export class Validator {

  _validAutoCorrect = false
  _validLang = 'rus'
  _message = 'что-то пошло не так!'

  constructor(params) {
    this.value = params.value
    this.valid = true
    this.message = this._message
    this.required = false
    if ('message' in params) this.message = params.message
    if ('required' in params) this.required = params.required
    if ('name' in params) this.name = params.name
    if ('validAutoCorrect' in params) this.validAutoCorrect = params.validAutoCorrect
    else this.validAutoCorrect = this._validAutoCorrect
    if ('validLang' in params) this.validLang = params.validLang
    else this.validLang = this._validLang

    switch (params.metod) {
      case 'empty':
        this.empty()
        break;
      case 'alphabet':
        this.alphabet()
        break;
      case 'apperCase':
        this.apperCase()
        break;
      case 'tel':
        this.tel()
        break;
      case 'email':
        this.email()
        break;
      case 'url':
        this.url()
        break;
    }

  }

  empty() {
    if (!this.value.trim() && this.required) {
      this.valid = false
      this.value = this.value.trim()
    } else {
      this.valid = true
      this.value = this.value.trim()
    }
  }

  alphabet() {
    this.arrayValue = [...this.value]
    this.alphabet = this[this.validLang]()
    this.alphabet.push(32)   // ' '    символы "-", "_", " "
    this.alphabet.push(45)   // '-'    интерпретируются как разделитель
    this.alphabet.push(95)   // '_'    двойного/тройного имени
    if (this.validAutoCorrect) {  // autocorrection
      this.newValue = []
      for (const liter of this.arrayValue) {
        if (this.alphabet.includes(liter.codePointAt(0))) {
          this.newValue.push(liter)
        }
      }
      this.value = this.newValue.join('')
      this.valid = true
    } else {                              // error
      for (const liter of this.arrayValue) {
        if (!this.alphabet.includes(liter.codePointAt(0))) this.valid = false
      }
    }
  }

  apperCase() {
    this.value = this.value
    .replace(/\-/g, ' ')
    .replace(/\_/g, ' ')
    .split(' ')
    .filter(str => str.trim().length > 0)
    .map(str => str.slice(0, 1).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase())
    .join('-');

    this.valid = true
  }

  tel() {
    this.arrayValue = [...this.value]
    this.alphabet = this.num()
    this.alphabet.push(43)   // '+'

    if (this.validAutoCorrect) {  // autocorrection
      this.newValue = []
      for (const liter of this.arrayValue) {
        if (this.alphabet.includes(liter.codePointAt(0))) {
          this.newValue.push(liter)
        }
      }
      if (this.newValue.length !== 12) {
        this.valid = false
        this.value = this.newValue.join('')
        this.message = 'Номер должен содержать 11 цифр'
        return
      }
      this.value = this.newValue.join('')

    } else {                              // error
      for (const liter of this.arrayValue) {
        if (!this.alphabet.includes(liter.codePointAt(0))) {
          this.valid = false
          this.message = 'Недопустимые символы в номере'
          return
        }
      }
      if (!(this.arrayValue[0] === '8' || (this.arrayValue[0] + this.arrayValue[1]) === '+7')) {
        this.valid = false
        this.message = 'Номер должен начинаться с +7 или 8'
        return
      }
      if (this.arrayValue[0] === '8' && this.arrayValue.length !== 11) {
        this.valid = false
        this.message = 'Номер должен содержать 11 цифр'
        return
      }
      if ((this.arrayValue[0] + this.arrayValue[1]) === '+7' && this.arrayValue.length !== 12) {
        this.valid = false
        this.message = 'Номер должен содержать 11 цифр'
        return
      }
    }
  }

  email() {
    this.arrayValue = [...this.value]
    if (!this.arrayValue.includes('@')) {
      this.valid = false
      this.message = 'Адрес email должен содержать символ @'
      return
    }
    this.arrayValue = this.arrayValue.join('').split('@')
    if (this.arrayValue.length > 2) {
      this.valid = false
      this.message = 'Адрес email может содержать только один символ @'
      return
    }
    if (this.arrayValue[1] === '') {
      this.valid = false
      this.message = 'Адрес email должен содержать символы после @'
      return
    }
  }

  url() {
    this.host = this.name.toLocaleLowerCase() + '.com/'
    this.hostUpper = this.name + '.com/'
    if (!this.validAutoCorrect) {           // errors
      if (!this.value.includes(this.host) ) {
        this.valid = false
        this.message = `Адрес должен содержать имя хоста ${this.host}`
        return
      }
    }

    if (this.value <= this.host) {
      this.valid = false
      this.message = `Адрес не полный`
      return
    }
  }


  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value ;
  }

  get valid() {
    return this._valid;
  }

  set valid(value) {
    this._valid = value;
  }

  get validAutoCorrect() {
    return this._validAutoCorrect;
  }

  set validAutoCorrect(value) {
    this._validAutoCorrect = value ;
  }

  get validLang() {
    return this._validLang;
  }

  set validLang(value) {
    this._validLang = value ;
  }

};

const alfabetsUTF16 = {
  num() {
    let arrayCode = []
    for (let i = 48; i <= 57; i++) {
      arrayCode.push(i)
    }
    return arrayCode
  },
  rus() {
    let arrayCode = []
    for (let i = 1040; i <= 1103; i++) {
      arrayCode.push(i)
    }
    arrayCode.push(1025)  //Ё
    arrayCode.push(1105)  //ё

    return arrayCode
  },
  eng() {
    let arrayCode = []
    for (let i = 65; i <= 90; i++) {
      arrayCode.push(i)
    }
    for (let i = 97; i <= 122; i++) {
      arrayCode.push(i)
    }
    return arrayCode
  },
  fra() {
    let arrayCode = []
    for (let i = 65; i <= 90; i++) {
      arrayCode.push(i)
    }
    for (let i = 97; i <= 122; i++) {
      arrayCode.push(i)
    }
    arrayCode.push(94)
    arrayCode.push(168)
    arrayCode.push(184)
    arrayCode.push(198)
    arrayCode.push(338)
    arrayCode.push(714)
    arrayCode.push(715)
    return arrayCode
  },
  deu() {
    let arrayCode = []
    for (let i = 65; i <= 90; i++) {
      arrayCode.push(i)
    }
    for (let i = 97; i <= 122; i++) {
      arrayCode.push(i)
    }
    arrayCode.push(196)
    arrayCode.push(214)
    arrayCode.push(220)
    arrayCode.push(223)
    arrayCode.push(228)
    arrayCode.push(246)
    arrayCode.push(252)
    arrayCode.push(7838)
    return arrayCode
  },
  esp() {
    let arrayCode = []
    for (let i = 65; i <= 90; i++) {
      arrayCode.push(i)
    }
    for (let i = 97; i <= 122; i++) {
      arrayCode.push(i)
    }
    arrayCode.push(161)
    arrayCode.push(191)
    arrayCode.push(209)
    arrayCode.push(241)
    return arrayCode
  },
}

Object.assign(Validator.prototype, alfabetsUTF16)







