'use strict';

require('dotenv').config()

const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const coinTicker = require('coin-ticker');
const utils = require('./utils/utils');
const ctrls = require('./controllers/tickets.controller');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(router);
app.get('/', (req, res) => {
  res.send('<h1>Welcome hackers to your next challenge! Hack me, get paid in SOL.</h1>');
});

// Connect to PotsgreSQL
const { Client } = require('pg');
const postgreURL = process.env.POSTGRE_URL;
const client = new Client(postgreURL);

client.connect(function(err) {
  if(err) {
    return console.error('Could not connect to DB...', err);
  } else {
    console.log('DB connected successfully!\n');
  }
});

const server = require('http').createServer(app);
const PORT = 5001;
// run server
server.listen(PORT, ()=> {
  console.log('listening on port', PORT);
  setInterval( function() {
    const time =  utils.getTime();
    const arr = time.split(':');
    if ( arr[2] == 0 ) {
      console.log(time);
      if ( arr[1] == 0 && arr[0] == 0 ) {
        const date = utils.getDateSQL();
        ctrls.createTable(client, date);
        console.log(date);
      }
    }
  }, 1000);
});

// socket.io 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});

let countUsers = 0;

io.on('connection', async (socket) => {

  countUsers++;
  console.log(`${countUsers} users connected`);
  io.emit('userNumber', `user_num: ${countUsers}`);
  
  const tickets = await ctrls.getTickets( client, utils.getDateSQL() )
  const potSOL = await tickets.length;
  coinTicker('bitstamp', 'SOL_USD').then( (price) => { 
    const potUSD = Math.floor(potSOL*price.last)
    io.emit('getPOT', { potSOL, potUSD });
  });
  io.emit('nPlayers', utils.nPlayers(tickets))
  io.emit('getTickets', tickets);

  socket.on('newTicket', async (ticket) => {
    console.log(ticket);
    const date = utils.getDateSQL();
    io.emit('postTicket', ctrls.postTicket( client, date, ticket ));

    const tickets = await ctrls.getTickets( client, utils.getDateSQL() )
    const potSOL = await tickets.length;
    coinTicker('bitstamp', 'SOL_USD').then( (price) => { 
      const potUSD = Math.floor(potSOL*price.last)
      io.emit('getPOT', { potSOL, potUSD });
    });
    io.emit('nPlayers', utils.nPlayers(tickets))
    io.emit('nNumbers', utils.nPlayers(tickets))
    io.emit('getTickets', tickets);
  })

  socket.on('disconnect', () => {
    countUsers--;
    console.log(`${countUsers} users connected`);
    io.emit('UserNumber', `user_num: ${countUsers}`)
  });

});
