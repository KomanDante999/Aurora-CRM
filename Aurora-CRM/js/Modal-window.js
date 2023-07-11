import { iconBtnClose } from "./icons.js";

export class ModalWindow{
  constructor(){
    this.$body = document.querySelector('body');
    this.$modal = document.createElement('div')
    this.$container = document.createElement('div')
    this.$contant = document.createElement('div')
    this.$btnCloseTop = document.createElement('button')

    this.$body.classList.add('over-hidden')
    this.$modal.classList.add('kd-modal', 'is-open')
    this.$container.classList.add('kd-modal__container', 'is-open')
    this.$contant.classList.add('kd-modal__contant')
    this.$btnCloseTop.classList.add('kd-modal__btn-close_top')

    this.$btnCloseTop.innerHTML = iconBtnClose

    this.$btnCloseTop.addEventListener('click', () => {
      this.closeWindow()
    })

    this.$container.addEventListener('mousedown', event => {
      event._mousedownOnContainer = true
    })
    this.$modal.addEventListener('mousedown', event => {
      if (!event._mousedownOnContainer) {
        this.closeWindow()
      }
    })

    this.$container.append(this.$btnCloseTop, this.$contant)
    this.$modal.append(this.$container)
    this.$body.append(this.$modal)


  }

  closeWindow() {
    this.$modal.classList.remove('is-open')
    this.$modal.classList.add('is-close')
    this.$container.classList.remove('is-open')
    this.$container.classList.add('is-close')
    this.$modal.addEventListener('animationend', () => {
      this.$modal.remove()
      this.$body.classList.remove('over-hidden')
    })
  }

  createBtnBottom(btnText) {
    this.$btnBottom = document.createElement('button')
    this.$btnBottom.textContent = `${btnText}`
    this.$btnBottom.classList.add('kd-modal__btn-bottom')
    this.$container.append(this.$btnBottom)
  }

  removeBtnBottom() {
    this.$container.remove(this.$btnBottom)
  }
}


