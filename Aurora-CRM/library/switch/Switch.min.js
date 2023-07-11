/*
let switchBtn = new SwitchBtn ({
  container: Node,
  options: {
    name: '',
    value: true,
  },
})
*/

export class SwitchBtn {
  _value = false
  _disable = false

  constructor(params) {

    this.userClass = 'user-class'
    if (params.userClass) this.userClass = params.userClass

    this.$button = document.createElement('button')
    this.$button.classList.add('switch', `${this.userClass}`)
    this.$button.addEventListener('click', () => {
      this.value = !this.value
    })

    this.name = params.options.name
    this.value = params.options.value
    this.disable = this._disable

    if ('container' in params) params.container.append(this.$button)
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    if (this.$button) {
      value ? this.$button.classList.add('is-selected') : this.$button.classList.remove('is-selected')
    }
  }

  get disable() {
    return this._disable;
  }

  set disable(value) {
    this._disable = value;
    if (this.$button) {
      if (value) {
        this.$button.disabled = true
        this.$button.classList.add('is-disable')
      } else {
        this.$button.disabled = false
        this.$button.classList.remove('is-disable')
      }
    }
  }
}


