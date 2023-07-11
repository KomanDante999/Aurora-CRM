export class ListClients {
  _sortKey = ''
  _sortDir = true

  constructor(params) {

    this.incomingData = []
    if (Array.isArray(params.dataTable)) this.incomingData = params.dataTable
    else this.incomingData.push(params.dataTable)


    this.arrayClients = []
    for (const client of this.incomingData) {
      this.arrayClients.push(new ParsingIncomingData(client))
    }
    this.sortKey = params.currentSort
  }

  sorted() {
    this.arrayClients.sort((a,b) => {
      if (this.sortDir ? a[this.sortKey] < b[this.sortKey] : a[this.sortKey] > b[this.sortKey]) return -1
    })
  }

  set sortKey(value) {
    this._sortKey = value
    if (value) this.sortDir = true
  }
  get sortKey() {
    return this._sortKey;
  }
  set sortDir(value) {
    this._sortDir = value
    this.sorted()
  }
  get sortDir() {
    return this._sortDir;
  }
}

class ParsingIncomingData {

  constructor(dataClient) {
    this.id = dataClient.id
    this.surname = dataClient.surname
    this.name = dataClient.name
    this.middleName = dataClient.lastName
    this.fullName = this.getFullName()
    this.dateCreation = new Date(Date.parse(dataClient.createdAt))
    this.dateUpdate = new Date(Date.parse(dataClient.updatedAt))
    this.contacts = []

    if (dataClient.contacts.length > 0) {
      for (const item of dataClient.contacts) {
        this.contact = {
          type: item.type,
          value: item.value,
        }
        this.contacts.push(this.contact)
      }
    }
  }

  getFullName() {
    return `${this.surname} ${this.name} ${this.middleName}`
  }

  dateToStr(date) {
    let year  = date.getFullYear()
    let month  = date.getMonth() +1
    let day  = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if (month < 10) month = `0${month}`
    if (day < 10) day = `0${day}`
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    return `${day}.${month}.${year}  ${hours}:${minutes}`
  }

}











