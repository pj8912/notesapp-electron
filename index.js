const {app, BrowserWindow} = require('electron')
const path = require('path')
const server = require('./app')
app.on('ready', function(){
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: __dirname + '/s.ico'


	})
	mainWindow.loadURL('http://localhost:5000/')
	mainWindow.focus()
})



