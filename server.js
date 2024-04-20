const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connection = require('./db');
const PORT = process.env.PORT || 8864;
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({  
  secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: false
}));

app.use(cors({
  origin: 'http://43.203.125.32',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200, 
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });


  connection.connect((err) => {
    if (err) {
      console.error('DB 연결 실패: ' + err.stack);
      return;
    }
    console.log('DB 연결 성공');
  });

  //회원가입
app.post('/api/signup', (req, res) => {
  const { username, password, email, name, birthdate, phoneNumber} = req.body;

  const query = `INSERT INTO members (username, password, email, name, birthdate, phoneNumber, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  connection.query(query, [username, password, email, name, birthdate,  phoneNumber], (err, result) => {
    if (err) {
      console.error('회원가입 실패: ' + err.stack);
      res.status(500).send('회원가입 실패');
      return;
    }
    console.log('회원가입 성공');
    res.status(200).send('회원가입 성공');
  });
});

//로그인
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM members WHERE username = ? AND password = ?`;

  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('로그인 실패: ' + err.stack);
      res.status(500).send('로그인 실패');
      return;
    }
    if (result.length === 0) {
      res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    const user = result[0];
    if (user.is_active !== 1) {
      res.status(401).send('비활성화된 계정입니다');
      return;
    }
    req.session.userId = user.id;

    console.log('세션에 저장된 기본키:', req.session.userId);

    res.status(200).json(user);
  });
});


app.get('/', (req, res) => {
    res.send("Express Test");
    });

// 서버 시작
app.listen(PORT, (req, res) => {
  console.log(`listening on http://localhost:${PORT}`);
});

