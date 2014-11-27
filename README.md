spark-inbox
===

This uses a Spark Core and the Internet Button to visualize the number of emails in your inbox. Find out more about this project [here](http://www.instructables.com/id/Spark-Inbox-Monitor/)

A simple LED wheel to illustrate the number of emails in your inbox. The number of LED's illuminated will represent the number of emails that are in your inbox.

Please see [here](http://www.instructables.com/id/Spark-Inbox-Monitor/) for how to set up the Spark Core.

Installing
---
`npm install`

Configuring
---
Rename config.example.json to config.json. In config.json, Using a text editor (such as Notepad), set the following:

* __accessToken__: your spark access token
* __deviceName__: your spark core name
* __user__: your imap username
* __password__: your imap password
* __host__: your imap host, e.g. imap-mail.outlook.com
* __port__: your imap host port, e.g. 993
* __tls__: whether your imap host uses TLS (true or false)
* __checkEvery__: how many seconds to wait between checking for emails (e.g. 60)
* __emailCountMax__: how many emails does all 11 leds represent? e.g. 11, where each LED represents 1 email.

Running
---
In a terminal, run `node app.js`.

Troubleshooting
---
* _i1 inbox log in failed_: check that the user, password, host, port and tls settings in config.json are correct
* _i2 could not retrieve inbox_: check that the user, password, host, port and tls settings in config.json are correct
* _s1 failed to login to spark_ : check that the accessToken in config.json is correct
* _s2 no spark named [name]_: check that the deviceName in config.json is correct
* _s3 could not run command_: make sure you have uploaded the firmware and check that the Spark Core is online (pulsing cyan light)
* _s4 failed to a list of devices_: check that the accessToken in config.json is correct
