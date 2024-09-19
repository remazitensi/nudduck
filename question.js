const express = require('express');
const cors = require('cors');
const app = express();
const port = 7000;

// CORS 설정 (클라이언트와 서버가 다른 도메인에 있을 경우 필요)
app.use(cors({
    origin: 'http://localhost:5173', // 클라이언트의 URL을 명시합니다.
    methods: ['GET', 'POST'],
}));

// JSON 요청과 응답을 처리할 수 있도록 설정
app.use(express.json());

app.get('/api/chat/questions', (req, res) => {
    const { category } = req.query;

    const questions = {
        면접: '면접 관련 질문입니다.',
        시나리오: '시나리오 관련 질문입니다.',
        문제해결: '문제 해결 관련 질문입니다.',
        상식: '상식 관련 질문입니다.',
        랜덤: '랜덤 질문입니다.',
    };

    res.json({ question: questions[category] || '질문을 찾을 수 없습니다.' });
});

// app.get('/api/questions', (req, res) => {
//     const category = req.query.category;
//     // 예를 들어, 카테고리에 따라 응답을 다르게 처리할 수 있습니다.
//     if (category === '면접') {
//         res.json({ question: "면접 관련 질문입니다." });
//     } else {
//         res.status(400).json({ error: "Invalid category" });
//     }
// });

app.delete('/api/chat/message', (req, res) => {
    res.json({ message: 'Chat messages deleted successfully'})
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
