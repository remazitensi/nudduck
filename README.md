# ![누떡](https://github.com/user-attachments/assets/1de146a0-53e8-439c-89c5-2de767121fe1)누떡 (NUDDUCK)

누워서 떡 먹기처럼 쉬운 면접 준비!

누떡이 도와줄게~ 😎

# 1. 프로젝트 구성 안내

누떡(NUDDUCK)은 AI 기반 면접 코칭과 커뮤니티 기능을 중심으로 개발된 플랫폼입니다. 이 프로젝트는 백엔드, 프론트엔드, AI 서버로 구성되어 있으며, 각각의 역할은 다음과 같습니다.

1. **AI 서버 (Flask, TensorFlow, Torch)**
    
    Flask와 TensorFlow, Torch를 활용하고, KoGPT-2모델에 면접데이터를 학습시킨 AI 모델을 개발하였습니다. AI 코치 기능은 AI 모델이 유저에게 다양한 면접 질문을 제공합니다.
    
2. **백엔드 서버 (Nest.js, TypeScript, MySQL, TypeORM, Jest)**
    
    백엔드 서버는 Nest.js와 TypeScript를 기반으로 개발되었으며, MySQL 데이터베이스와 연결되어 유저 데이터를 관리합니다. TypeORM을 사용하여 ORM(객체 관계 매핑)을 처리하고, Jest를 통해 유닛 테스트가 수행됩니다. 주요 기능으로는 사용자 인증, 데이터 처리 및 저장, 커뮤니티 게시글 관리 등이 포함됩니다.
    
3. **프론트엔드 (React, TypeScript, Chart.js)**
    
    프론트엔드는 React와 TypeScript로 구성되어 있으며, 유저 인터페이스(UI)와 경험(UX)을 최적화하여 제공됩니다. 유저의 인생 그래프를 시각적으로 표현하기 위해 Chart.js를 사용하고 있으며, 이를 통해 복잡한 데이터를 직관적으로 보여줍니다.
    
4. **배포 및 관리 (NGINX, PM2)**
    
    서버 및 AI 모델 배포는 NGINX와 PM2를 통해 안정적으로 관리됩니다. PM2를 사용해 서버 프로세스를 관리하고, NGINX는 리버스 프록시 서버로 동작하여 트래픽을 처리합니다.
    
5. **협업 도구 (GitLab, Notion, Figma)**
    
    팀원 간의 원활한 협업을 위해 GitLab을 통한 버전 관리, Notion을 통한 프로젝트 관리, Figma를 사용해 프론트엔드 팀과의 디자인 협업을 진행합니다.
    

# 2. 프로젝트 소개

누떡(NUDDUCK) 플랫폼에서 유저는 AI 코치를 통해 예상 면접 질문을 받고, 이를 통해 실전 대비를 할 수 있습니다. 또한, 관심사 기반 커뮤니티 기능을 통해 유저는 쉽게 면접 메이트를 찾고 교류할 수 있습니다.

누떡은 유저의 인생 사건을 시각적으로 표현한 인생 그래프를 제공해, 면접에서 본인의 경험을 더 효과적으로 설명할 수 있도록 돕습니다. 이 그래프는 긍정/부정 경험과 난이도를 기반으로 시각적 효과를 더해 직관적으로 제공됩니다.

이외에도 매일 제공되는 명언과 영어 문장으로 유저가 지속적으로 동기 부여를 받을 수 있으며, 분야별 전문가와의 상담을 통해 실질적인 피드백을 받을 수 있습니다.

**기술 스택 및 도구**:
<table>
  <tr>
    <td>프론트엔드</td>
    <td> 
        <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> 
        <img alt="typescript" src ="https://img.shields.io/badge/typescript-3178C6.svg?&style=for-the-badge&logo=typescript&logoColor=white"/> 
        <img alt="tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white">
        <img alt="chartjs" src="https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white">
        <img alt="emojimart" src="https://img.shields.io/badge/emoji Mart-%23FF0000.svg?style=for-the-badge&logo=emojiMart&logoColor=white">
    </td>
  </tr>
  <tr>
    <td>백엔드</td>
    <td>
        <img alt="nestjs" src="https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/> 
        <img alt="TypeORM" src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=TypeORM&logoColor=white"> 
        <img alt="MySQL" src ="https://img.shields.io/badge/mysql-4479A1.svg?&style=for-the-badge&logo=mysql&logoColor=white"/> 
        <img alt="dotenv" src ="https://img.shields.io/badge/dotenv-ECD53F.svg?&style=for-the-badge&logo=dotenv&logoColor=white"/> 
        <img alt="swagger" src ="https://img.shields.io/badge/swagger-85EA2D.svg?&style=for-the-badge&logo=swagger&logoColor=white"/>       <img alt="jest" src ="https://img.shields.io/badge/jest-C21325.svg?&style=for-the-badge&logo=jest&logoColor=white"/> 
        <img alt="typescript" src ="https://img.shields.io/badge/typescript-3178C6.svg?&style=for-the-badge&logo=typescript&logoColor=white"/>
    </td>
  </tr>
  <tr>
    <td>AI</td>
    <td>
        <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"> 
        <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white">
        <img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" >
        <img src="https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white">
    </td>
  </tr>
  <tr>
    <td>배포</td>
    <td> 
        <img src="https://img.shields.io/badge/Google Cloud-4285F4?style=for-the-badge&logo=Google Cloud&logoColor=white"/>
        <img alt="nginx" src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white"> 
        <img alt="pm2" src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">
    </td>
  </tr>
  <tr>
    <td>협업</td>
    <td> 
        <img src="https://img.shields.io/badge/Notion-FFFFFF?style=for-the-badge&logo=notion&logoColor=black" /> 
        <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
        <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" /> 
        <img src="https://img.shields.io/badge/Gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white" />
    </td>
  </tr>
</table>  

# 3. 프로젝트 목표

- 학습된 AI 모델을 통해 다양한 면접 질문을 제공하고 이에 유저가 실전에 대비함으로써 면접실력의 향상을 목표로 한다.
- 유저별 해시태그 기반 커뮤니티를 조성하여 보다 쉽게 면접 메이트를 구하도록 지원한다.
- 유저의 인생 그래프를 시각적으로 표현해 한 눈에 파악할 수 있게 돕고 이를 면접 시 활용하도록 한다.

# 4. 프로젝트 기능 설명

### 1. **소셜 로그인, 인기 게시글** :  구글과 카카오 소셜로그인과 인기 게시글

- 조회순으로 인기 게시글 제공

<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/7822cdc3-611b-4eb6-a41e-4af296b1932f" alt="로그인" width="500"/>
  <img src="https://github.com/user-attachments/assets/0eeb81cc-e1d6-46e2-a1d2-49e315dfebae" alt="인기 게시글" width="500"/>
</div>

### 2. **1 Day 1 Tip** :  매일 바뀌는 명언과 영문장

- 매일 다른 명언과 영문장을 제공

<img src="https://github.com/user-attachments/assets/31eb29da-9a6e-4ef1-89d2-29b1c3008316" alt="명언, 영문장" width="500"/>

### 3. **AI COACH :** 고민되는 선택, 예상 면접 질문 등 무엇이든 도와주는 AI 코치

- 면접 빈출 주제에 관한 다양한 면접 질문을 제공
- 히스토리를 기록하여 추후 선택에 사용

<img src="https://github.com/user-attachments/assets/141e34a7-4f52-4bf3-a884-22e8183f321a" alt="AI 페이지, 대화" width="500"/>

### 4. **EXPERT with you** : 각 분야 전문가와 상담

- 분야별 전문가 연결

<img src="https://github.com/user-attachments/assets/b0a0b5e9-db2c-436b-92ad-d6230df9a4f8" alt="전문가 페이지" width="500"/>

### 5. **COMMUNITY** : 누떡에서 만나는 면접 메이트

- 관심사 카테고리를 기반으로 우선 필터링 된 커뮤니티 게시글 제공

<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/569e6a97-f5e9-4254-a477-c7a2268141ce" alt="커뮤니티 페이지" width="500"/>
  <img src="https://github.com/user-attachments/assets/10fb7715-e9ac-4c05-a32e-e6544a544735" alt="커뮤니티 게시글, 댓글" width="500"/>
</div>

### 6. **LIFE GRAPH** : 한 눈에 파악할 수 있는 인생 그래프

- 유저가 참고할 수 있는 예시 그래프를 제공
- 유저로부터 인생의 사건 정보를 입력받아 인생 그래프를 생성하고 난이도와 긍/부정에 따른 시각 효과를 제공
- 인생 그래프를 저장 및 수정

<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/ab821d75-347a-4e2d-9676-d0fea9727c4a" alt="인생그래프 페이지" width="500"/>
  <img src="https://github.com/user-attachments/assets/5967a1a5-4829-4c5d-b1ab-4d3e35989035" alt="인생그래프 작성, 수정, 삭제, 즐겨찾기" width="500"/>
</div>

### 7. **마이 페이지** : 유저 정보 확인

- 유저의 이미지, 닉네임, 해시태그 수정 기능 제공
- 유저가 작성한 게시글 한눈에 확인 가능
- 유저가 작성한 인생그래프 확인 가능

<img src="https://github.com/user-attachments/assets/961ffd70-15ea-4c80-a903-489803893f7f" alt="마이페이지, 수정" width="500"/>

# 5. 프로젝트 구성도

- 와이어 프레임

![와프.PNG](https://github.com/user-attachments/assets/1500d781-37ec-489b-b244-cf81ad51b021)

- ERD

![erd.PNG](https://github.com/user-attachments/assets/83622ce7-99d4-48b4-bd63-db7c692f06b0)

- 플로우차트

![플로우차트.jpg](https://github.com/user-attachments/assets/416493e6-5642-4256-b35f-3fb07d1af905)


- API 명세서(SWAGGER)

<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/e45ece7a-f647-4edb-8df9-b29fe63d714f" alt="명세서1" width="500"/>
  <img src="https://github.com/user-attachments/assets/ff04776b-c10e-49f8-8888-7c7750839ade" alt="명세서2" width="500"/>
</div>
<div style="display: flex; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/6d9fae0f-1ac9-4f00-9962-0f4c143b90bc" alt="스키마1" width="500"/>
  <img src="https://github.com/user-attachments/assets/78532850-519b-4f12-8579-a77df6a88058" alt="스키마2" width="500"/>
</div>

# 6. 실행 방법
### 1. 프로젝트 클론
```bash
git clone https://github.com/your-repo/nudduck.git
cd nudduck
2. .env 파일 설정
서버(server)와 클라이언트(client) 폴더에 각각 .env 파일을 생성해야 합니다. .env 파일의 설정 값은 프로젝트 설정에 맞게 지정합니다.

3. 의존성 설치
서버와 클라이언트 디렉토리 각각에서 필요한 패키지를 설치합니다:
```
### 2. 서버 의존성 설치
```bash
cd server
npm install
```
### 3. 클라이언트 의존성 설치
```bash
cd ../client
npm install
```

### 4. 서버 실행
```bash
cd ../
npm run start
```
서버가 정상적으로 실행되면, 클라이언트와 백엔드 서버가 구동되며, 브라우저에서 서비스를 사용할 수 있습니다.

# 7. .env 파일 설정

### 1. 서버 환경 변수 (.env)
```bash
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_CALLBACK_URL=http://localhost:3000/api/auth/kakao/callback

HOME_PAGE=http://localhost:5173/HomePage
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

AWS_REGION=ap-northeast-2
S3_ACCESS_KEY=your-s3-access-key
S3_SECRET_KEY=your-s3-secret-key
S3_BUCKET=your-s3-bucket-name
DEFAULT_PROFILE_IMAGE_URL=https://your-s3-bucket-url/Default-Profile-Picture.png

AI_QUERY_URL=http://localhost:5000/query
FIRST_AI_MSG=어떤 면접질문을 드릴까요?
```
### 2. 클라이언트 환경 변수 (.env)
```bash
VITE_BACK_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api
```
이 .env 파일들을 프로젝트의 서버와 클라이언트 각각의 디렉토리에 위치시켜 주세요. your-db-host, your-s3-access-key 등의 값은 실제 환경에 맞게 변경해야 합니다.

# 8. 프로젝트 팀원 역할 분담

| 이름 | 담당 업무 |
| --- | --- |
| 김재영 | 팀장 / 백엔드 |
| 이승철 | 팀원 / 백엔드 / AI |
| 김민지 | 팀원 / 프론트엔드 |
| 김우현 | 팀원 / 프론트엔드 |
| 임형선 | 팀원 / 프론트엔드 |
| 황솜귤 | 팀원 / 프론트엔드 |
