const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors()); // CORS 설정 추가
app.use(express.json()); // JSON 요청을 처리하기 위한 미들웨어 추가

// 임시 영화 데이터
const movies = [
  { id: 1, title: 'Movie 1', box_office_rank: 1, release_date: '2024-01-01' },
  { id: 2, title: 'Movie 2', box_office_rank: 2, release_date: '2024-01-02' },
  // 필요한 만큼 영화 데이터를 추가하세요.
];

// API 엔드포인트 설정
app.get('/api/movies/', (req, res) => {
  res.json(movies);
});

// Express 라우팅 설정
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// HTTP 서버 생성
const server = http.createServer(app);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// 서버를 특정 포트에서 수신 대기
server.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
