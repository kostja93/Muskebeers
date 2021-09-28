import L from 'leaflet'
import { getColorForValue } from './colors'

export default class Player {
  constructor() {
    this.events = {}
  }

  setMap(map) {
    this.map = map
  }

  on(key, method) {
    this.events[key] = method
  }

  emit(key) {
    if(this.events[key])
      this.events[key]()
  }

  setPosition(coords, accuracy) {
    let firstTimeCall = true
    if(this.position) {
      this.lastPoint = L.latLng(this.position.lat, this.position.lng)
      firstTimeCall = false
    }

    this.position = { ... coords, accuracy}
    this.color = this.calculateColor()

    if(firstTimeCall)
      this.emit('firstLocation')
    else
      this.emit('locationupdate')
  }

  setQuestion(feature) {
    this.feature = feature
  }

  initCircle() {
    let radius = this.position.accuracy / 2
    let coords = [this.position.lat, this.position.lng]
    this.circle = L.circle(coords, radius)
    this.circle.addTo(this.map)
  }

  setPopupQuestion() {
    let questionHtml = this.popupHtml()
    this.circle.bindPop(questionHtml)
    this.circle.openPop()
  }

  popupHtml() {
    return `${feature.properties.question}<br><button class="btn btn-danger">skip</button>`
  }

  calculateColor() {
    if(!this.feature) return 'green'
    let currentPoint = L.latLng(this.position.lat, this.position.lng)
    let questionPoint = L.latLng(this.feature.geometry.coordinates)
    let distanceKm = currentPoint.distanceTo(questionPoint) / 1000.0
    return getColorForValue(distanceKm)
  }

  updateCircle() {
    let radius = this.position.accuracy / 2.0
    this.circle.setRadius(radius)
    this.circle.setStyle({ color: this.color })
    this.circle.openPop()
  }

  drawLine() {
    let currentPoint = L.latLng(this.position.lat, this.position.lng)
    L.polyline([this.lastPoint, currentPoint], { color: this.color })
      .addTo(this.map)
  }
}
