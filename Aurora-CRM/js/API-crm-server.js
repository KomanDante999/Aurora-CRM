
export  class ApiCrmServer {

  constructor(params) {

    this.urlServer = params.urlServer
    this.sendData = []
    if (params.sendData) {
      if (Array.isArray(params.sendData)) this.sendData = params.sendData
      else this.sendData.push(params.sendData)
    }
    this.getData = null
    this.id = ''
    if (params.id) this.id = params.id
    this.searchStr = ''
    if (params.searchStr) this.searchStr = params.searchStr

  }

  async post() {
    for (const client of this.sendData) {
      this.response = await fetch(this.urlServer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(client),
      })
    }
  }

  async get() {
    this.response = await fetch(this.urlServer)
    this.getData = await this.response.json()
}

  async getId() {
      this.response = await fetch(`${this.urlServer}/${this.id}`)
      this.getData = await this.response.json()
  }

  async search() {
      this.response = await fetch(`${this.urlServer}?search=${this.searchStr}`)
      this.getData = await this.response.json()
  }

  async patch() {
    this.response = await fetch(`${this.urlServer}/${this.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(this.sendData[0]),
    })
    this.getData = await this.response.json()
  }

  async delete() {
    this.response = await fetch(`${this.urlServer}/${this.id}`, {
      method: 'DELETE',
    })
  }

  async deleteAll() {
    for (const client of this.getData) {
      this.response = await fetch(`${this.urlServer}/${client.id}`, {
        method: 'DELETE',
      })
    }
  }

  statusMessage() {
    switch (this.response.status) {
      case 200:
        return 'запрос обработан нормально'
      case 201:
        return 'запрос на создание нового элемента успешно обработан'
      case 404:
        return 'запрашиваемый элемент не найден в базе данных'
      case 422:
        return 'переданный объект не прошёл валидацию'
      case 500:
        return 'странно, но сервер сломался'
    }
  }

  get urlServer() {
    return this._urlServer;
  }

  set urlServer(value) {
    this._urlServer = value;
  }

  get sendData() {
    return this._sendData;
  }

  set sendData(value) {
    this._sendData = value;
  }

  get getData() {
    return this._getData;
  }

  set getData(value) {
    this._getData = value;
  }

  get response() {
    return this._response;
  }

  set response(value) {
    this._response = value;
  }
};


