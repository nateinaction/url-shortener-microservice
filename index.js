var express = require('express')
var admin = require('firebase-admin')
var validUrl = require('valid-url')

var serviceKey = process.env.SERVICE_KEY || require('./serviceKey.json')
console.log(typeof(serviceKey), serviceKey)
admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
  databaseURL: 'https://url-shortener-microservi-685f2.firebaseio.com'
})

var db = admin.database()
var app = express()

var checkValidURL = (data, res) => {
  if (validUrl.isUri(data)){
      var key = db.ref().push(data).key
      return res.json({
        url: data,
        short: 'https://rocky-stream-76935.herokuapp.com/' + key
      })
  } else {
    return checkValidShort(data, res)
  }
}

var checkValidShort = (data, res) => {
  var notValid = ['.', '#', '$', '[', ']']
  var valid = true
  notValid.forEach((item) => {
    if (data.indexOf(item) !== -1) {
      valid = false
    }
  })
  if (!valid) {
    return res.json({error: 'Please enter a valid URL or shortcode.'})
  }
  return lookupShort(data, res)
}

var lookupShort = (data, res) => {
  return db.ref(data).once('value').then((snap) => {
    if (!snap.val()) {
      return res.json({error: 'Please enter a valid URL or shortcode.'})
    }
    return res.redirect(snap.val())
  })
}

app.get('/*', (req, res) => {
  var data = req.params[0] || null
  if (!data) {
    return res.end('Enter a valid URL or shortcode behind the trailing /')
  }
  return checkValidURL(data, res)
})

app.listen(process.env.PORT || 5000)
