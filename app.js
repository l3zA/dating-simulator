const express = require('express')
const bodyParser = require('body-parser')
const sampleSize = require('lodash.samplesize')

const app = express()

app.use(express.static('public'))

const urlencodedParser = bodyParser.urlencoded({ extended: true })

const loveScoreMatrix = {
  flower:   [-1,  0,  2],
  ring:     [ 2, -1,  1],
  necklace: [ 0,  3,  0],
  tea:      [ 5,  5,  5]
}

let loveScore
const limitLoveScore = 20
const limitDayLeft = 0

let dayLeft
const limitDay = 0

const reset = function() {
  loveScore = 0
  dayLeft = 15
}

reset()

const title = `
  <h1>Dating Simulator</h1>
`

const loveScoreView = function() {
  return `
    <h2>Love Score</h2>
    <h3>${loveScore}</h3>
  `
}

const dayLeftView = function() {
  return `
    <h2>Day Left</h2>
    <h3>${dayLeft}</h3>
  `
}

const image = `
  <img height="100px" width="100px" src="choco.jpg" />
`

const itemButton = function(name) {
  return `
    <form id="${name}" action="/" method="POST">
      <input name="item" type="hidden" value="${name}" />
      <button type="${name}">${name}</button>
    </form>
  `
}



const itemButtons = function() {
  const items = sampleSize(Object.keys(loveScoreMatrix), 3)
  let str = '<div>'
  items.forEach(function(item) {
    str += itemButton(item)
  })
  str += '</div>'
  return str
}

const completeView = function(message) {
  return `
    ${title}
    ${loveScoreView()}
    ${dayLeftView()}
    ${image}
    <h1>${message}</h1>
    <form action="/restart" method="POST">
      <button>Play Again!</button>
    </form>
  `
}

const gamePlayView = function() {
  if (loveScore >= limitLoveScore) {
    return completeView('Congratulations!!!')
  } else if (dayLeft <= limitDayLeft) {
    return completeView('Game Over!!!')
  } else {
    return `
      ${title}
      ${loveScoreView()}
      ${dayLeftView()}
      ${image}
      ${itemButtons()}
    `
  }
}

app.get('/', function(request, response) {
  response.send(`
    ${title}
    ${loveScoreView()}
    ${dayLeftView()}
    ${image}
    ${itemButtons()}
  `)
})

app.post('/', urlencodedParser, function(request, response) {
  const { item } = request.body
  const loveScoreChange = loveScoreMatrix[item][dayLeft % 3]
  loveScore += loveScoreChange
  dayLeft -= 1
  response.send(gamePlayView())
})

app.post('/restart', function(request, response) {
  reset()
  response.redirect('/')
})

app.listen(3000)
