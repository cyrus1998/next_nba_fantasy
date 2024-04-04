const next = require('next');
const http = require('http');
const socketIO = require('socket.io');
const dbConnect = require('./utils/dbConnectWrapper');
const LotteryOrder = require('./model/lotteryOrderWrapper');
const Player = require('./model/playerWrapper');
const UserTeam = require('./model/userTeamWrapper');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });


app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    if (req.url === '/api/lottery-start' && req.method === 'POST') {
      console.log("lottery start request received")
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', async () => {
        const data = JSON.parse(body);
        await LotteryOrder.create(data); //unable to create
        console.log("data in lottery-start",data)
        io.emit('lottery-ready',data.order,data.timestamp);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'success' }));
      });
    }
    
  });
  dbConnect();

  const io = new socketIO.Server(server,{
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  

  io.on('connection', (socket) => {
    console.log('Socket.IO client connected');
    socket.on('lottery-select', async (user, selected) => {
      console.log("lottery-select event recevied",selected,typeof(selected))
      const player = await Player.findOne({player_id: selected}).lean()
      console.log("lottery-select event",player.name)
      const userTeam = await UserTeam.findOne({email: user}).lean()
      const lotteryOrder = await LotteryOrder.findOne().sort('-timestamp').lean()
      if (lotteryOrder.order[-1]===user && userTeam?.player.length===5){
        io.emit('next-play', user, player.name,true);
      }else{
        io.emit('next-play', user, player.name,false);
      }
    });
  });

  const PORT = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT, 10) : 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
