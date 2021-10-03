const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = [] //dummy in memory store
const saveToDatabase = async subscription => {
  dummyDb.push(subscription)
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  
  const subscription = req.body
  await saveToDatabase(subscription);
  res.json({ message: 'success' })
})
const vapidKeys = {
  publicKey:
    'BDr7n2-WOOM9uQ4cwxVvVov6gLzUtCROcHIDQGR_dUwep7O0rPLD0vAdeYzckYoCx0wLkwMtdLgq4XEtPtQe3A8',
  privateKey: 'iY0l6hsK4UKIScNnzeL3IM0hfx64vLGAAnrI4G1ZUJQ',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
// send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend)
}
//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription;
 
console.log("dummyDb",dummyDb)
  const message = 'Wappier Notication message';
  dummyDb.forEach(sub => {
    console.log("subscription.endpoint: ", sub)
    sendNotification(sub, message);
});
 
  res.json({ message: 'message sent' })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
