require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const colors = require('colors');

const config = require('./config/env-variables');
const mongodbConnection = require('./config/db');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const { errorHandler, notFound } = require('./middleware/error');

const { port, origin } = config;

const version = 'v1';

const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);

app.use(cors({ origin, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// app.use(express.static(__dirname + '/public'));

// io.on('connection', socket => {
//   console.log('An user connected');

//   socket.on('disconnect', () => {
//     console.log('An user disconnected');
//   });

//   socket.on('message', message => {
//     console.log('Received message:', message);
//     io.emit('message', message);
//   });
// });

mongodbConnection();
// const server = http.createServer(app);

app.use(`/${version}/chat`, chatRouter);
app.use(`/${version}/users`, userRouter);
app.use(`/${version}/account`, authRouter);
app.use(`/${version}/messages`, messageRouter);
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running');
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', socket => {
  console.log('connected socket');

  socket.on('setup', userData => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', room => {
    socket.join(room);
  });

  socket.on('new message', newMessage => {
    const chat = newMessage.chat;

    if (!chat.user) return;

    chat.users.forEach(user => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit('message received', newMessage);
    });
  });
});
