// required property only 'target'
// if there are no other properties, they will be set by default

// new Toollee({
//   target: Node,                      // required, target element for tooltip
//   content: 'Привет!
//    Я Toolle - веселые подсказки!',   // tooltip conten: string or HTML (default "Привет! Я Toolle - веселые подсказки!")
//   setUser: {                         // tooltip set: if there are none the default settings will be applied
//     theme: 'black',                  // tooltip desing theme default: 'black', 'white', 'violet', 'red1', 'blue' (default 'black')
//     blocking: true,                  // blocking the position by clicl on target: 'true', 'false' (default 'false')
//     userClass: 'user-toollee',       // custom class name for elements of tooltip (default none)
//     position: 'top',                 // the position of the tooltip relative to the target: 'top', 'bottom', 'left' or 'right' (default 'top')
//     offsetTooltipe: 'start',         // offset of the tooltip position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
//     offsetArrow: 'start',            // offset of the arrow position relative to the target element: 'start', 'center', 'end', '20px' or '10%' (default 'center')
//     margin: 10,                      // indent between the target element and the tooltip  (default 6px)
//     arrowWidth: 15,                  // arrow width (default 15px)
//     arrowHeight: 10,                 // arrow height (default 10px)
//   }
// })

export class Toollee {
  _tooltipX = 0
  _tooltipY = 0
  _arrowX = 0
  _arrowY = 0

  constructor(params) {

    this.$target = params.target

    this.createLayout()

    this.tooltipX = this._tooltipX
    this.tooltipY = this._tooltipY
    this.arrowX = this._arrowX
    this.arrowY = this._arrowY
    this.triggerBlocking = false
    this.widthWindow = document.documentElement.clientWidth

    if (params.content) {
      this.$content.append(params.content)

    } else {
      this.$content.textContent = 'Привет! Я Toolle - веселые подсказки!'
    }
    // set of params
    if (params.setUser.theme) this.setTheme(params.setUser.theme)
    else this.setTheme('black')

    if (params.setUser.blocking) this.blocking = params.setUser.blocking
    else this.blocking = false

    if (params.setUser.userClass) this.setUserClass(params.setUser.userClass)

    if (params.setUser.position) this.position = params.setUser.position
    else this.position = 'top'

    this.offsetTooltipeValue = 0
    if (params.setUser.offsetTooltipe) this.offsetTooltipe = params.setUser.offsetTooltipe
    else this.offsetTooltipe = 'center'

    if (params.setUser.offsetArrow) this.offsetArrow = params.setUser.offsetArrow
    else this.offsetArrow = 'center'

    if (params.setUser.margin) this.margin = params.setUser.margin
    else this.margin = 6

    if (params.setUser.arrowWidth) this.arrowWidth = params.setUser.arrowWidth
    else this.arrowWidth = 15

    if (params.setUser.arrowHeight) this.arrowHeight = params.setUser.arrowHeight
    else this.arrowHeight = 10

    if ('removeOnClickOut' in params.setUser) this.removeOnClickOut = params.setUser.removeOnClickOut
    else this.removeOnClickOut = true

    // events

    this.$target.addEventListener('mouseenter', () => {
      this.addTooltip()
    })
    this.$target.addEventListener('mouseleave', () => {
      this.removeTooltip()
    })
    this.$target.addEventListener('focusin', () => {
      this.addTooltip()
    })
    this.$target.addEventListener('focusout', () => {
      this.removeTooltip()
    })


    if (this.blocking) this.$target.addEventListener('click', (event) => {
      event._clickOnTarget = true
      this.triggerBlocking = !this.triggerBlocking

      window.addEventListener('resize', () => {
        this.removeTooltip()
        this.addTooltip()
      })

      if (this.removeOnClickOut) {

        this.$tooltip.addEventListener('click', (event) => {
          event._clickOnTooltip = true
        })

        document.body.addEventListener('click', (event) => {
          if (!event._clickOnTarget && !event._clickOnTooltip) {
            this.$tooltip.remove()
            this.triggerBlocking = false
          }
        })
      }
    })
  }

  createLayout() {
    this.$tooltip = document.createElement('div')
    this.$arrow = document.createElement('div')
    this.$content = document.createElement('div')
    this.$tooltip.classList.add('toollee')
    this.$tooltip.style.position = 'absolute'
    this.$arrow.classList.add('toollee__arrow')
    this.$arrow.style.position = 'absolute'
    this.$content.classList.add('toollee__content')
    this.$tooltip.append(this.$content, this.$arrow)
  }

  addTooltip() {

    document.body.append(this.$tooltip)
    this.getMetrics()
    this.arrowSize()
    this.arrowType()
    this.setOffsetTooltipe()
    this.setPositionTooltip()
    this.setPositionArrow()
  }

  removeTooltip() {
    if (!this.triggerBlocking) {
      this.$tooltip.remove()
    }
  }

  setTheme(theme) {
    this.$tooltip.classList.add(`toollee__theme_${theme}`)
    this.$arrow.classList.add(`toollee__theme_${theme}`)
    this.$content.classList.add(`toollee__theme_${theme}`)
  }

  setUserClass(userClass) {
    this.$tooltip.classList.add(`${userClass}`)
    this.$arrow.classList.add(`${userClass}__arrow`)
    this.$content.classList.add(`${userClass}__content`)
  }

  getMetrics() {
    this.tooltipMetrics = this.$tooltip.getBoundingClientRect()
    this.targetMetrics = this.$target.getBoundingClientRect()
    // console.log(this.tooltipMetrics, this.targetMetrics);
  }

  arrowSize() {
    switch (this.position) {
      case 'bottom':
      case 'top':
        this.$arrow.style.width = `${this.arrowWidth}px`
        this.$arrow.style.height = `${this.arrowHeight}px`
        break;
      case 'left':
      case 'right':
        this.$arrow.style.width = `${this.arrowHeight}px`
        this.$arrow.style.height = `${this.arrowWidth}px`
        break;
    }
  }

  arrowType() {
    switch (this.position) {
      case 'top':
        this.$arrow.innerHTML = arrowDown
        break;
      case 'bottom':
        this.$arrow.innerHTML = arrowUp
        break;
      case 'left':
        this.$arrow.innerHTML = arrowRight
        break;
      case 'right':
        this.$arrow.innerHTML = arrowLeft
        break;
    }
  }

  setOffsetTooltipe() {
    switch (this.position) {
      case 'top':
      case 'bottom':

        switch (this.offsetTooltipe) {
          case 'start':
            this.offsetTooltipeValue = this.$tooltip.offsetWidth / 2 + this.$target.offsetWidth / 2
            break;
          case 'center':
            this.offsetTooltipeValue = 0
            break;
          case 'end':
            this.offsetTooltipeValue = (this.$tooltip.offsetWidth / 2 - this.$target.offsetWidth / 2) * -1
            break;
        }
        break;

      case 'left':
      case 'right':

        switch (this.offsetTooltipe) {
          case 'start':
            this.offsetTooltipeValue = this.$tooltip.offsetHeight / 2 - this.$arrow.offsetHeight / 2
            break;
          case 'center':
            this.offsetTooltipeValue = 0
            break;
          case 'end':
            this.offsetTooltipeValue = - this.$tooltip.offsetHeight / 2 + this.$arrow.offsetHeight / 2
            break;
        }
        break;
    }

  }

  setPositionTooltip() {
    switch (this.position) {
      case 'top':
      case 'bottom':
        this.tooltipX = this.targetMetrics.left - this.$tooltip.offsetWidth / 2 + this.$target.offsetWidth / 2 + this.offsetTooltipeValue + window.pageXOffset
        break;
      case 'left':
      case 'right':
        this.tooltipY = this.targetMetrics.top - this.$tooltip.offsetHeight / 2 + this.$target.offsetHeight / 2 + window.pageYOffset + this.offsetTooltipeValue
        break;
    }

    switch (this.position) {
      case 'top':
        this.tooltipY = this.targetMetrics.top - this.$tooltip.offsetHeight - this.$arrow.offsetHeight - this.margin + window.pageYOffset
        break;
      case 'bottom':
        this.tooltipY = this.targetMetrics.bottom + this.$arrow.offsetHeight + this.margin + window.pageYOffset
        break;
      case 'left':
        this.tooltipX = this.targetMetrics.left - this.$tooltip.offsetWidth - this.$arrow.offsetWidth - this.margin + window.pageXOffset
        break;
      case 'right':
        this.tooltipX = this.targetMetrics.right + this.$arrow.offsetWidth + this.margin + window.pageXOffset
        break;
    }
  }

  setPositionArrow() {
    this.$arrow.style[this.position] = '100%'

    switch (this.position) {
      case 'top':
      case 'bottom':

        switch (this.offsetTooltipe) {
          case 'start':
            break;
          case 'center':
            this.$arrow.style.transform = `translateX(${this.$tooltip.offsetWidth / 2 - this.$arrow.offsetWidth / 2}px)`
            break;
          case 'end':
            this.$arrow.style.transform = `translateX(${this.$tooltip.offsetWidth - this.$arrow.offsetWidth}px)`
            break;
        }
        break;

      case 'left':
      case 'right':

        switch (this.offsetTooltipe) {
          case 'start':
            this.$arrow.style.transform = `translateY(${- this.$tooltip.offsetHeight}px)`
            break;
          case 'center':
            this.$arrow.style.transform = `translateY(${-this.$tooltip.offsetHeight / 2 - this.$arrow.offsetHeight / 2}px)`
            break;
          case 'end':
            this.$arrow.style.transform = `translateY(${- this.$arrow.offsetHeight}px)`
            break;
        }
        break;
    }

  }

  get tooltipX() {
    return this._tooltipX;
  }
  set tooltipX(value) {
    this._tooltipX = value;
    this.$tooltip.style.left = `${this._tooltipX}px`
  }
  get tooltipY() {
    return this._tooltipY;
  }
  set tooltipY(value) {
    this._tooltipY = value;
    this.$tooltip.style.top = `${this._tooltipY}px`
  }


};

// arrows
const arrowDown =
`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="12, 24 0, 0 24, 0" fill="currentColor"/>

</svg>`;
const arrowUp =
`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="12, 0 24, 24 0, 24" fill="currentColor" />
</svg>`;
const arrowLeft =
`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0, 12 24, 0 24, 24" fill="currentColor" />
</svg>`;
const arrowRight =
`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="24, 12 0, 24 0, 0" fill="currentColor" />
</svg>`;



