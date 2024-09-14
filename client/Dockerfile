# Step 1: React 앱 빌드
FROM node:22 AS build

WORKDIR /client

# 의존성 설치
COPY client/package.json client/package-lock.json ./
RUN npm install

# 나머지 애플리케이션 파일 복사
COPY client/ ./

# 환경 변수용 .env 파일 복사
COPY client/.env.production .env

# 애플리케이션 빌드
RUN npm run build

# Step 2: 간단한 HTTP 서버를 사용하여 React 앱 제공
FROM node:22

WORKDIR /client

# 이전 단계에서 빌드된 출력 파일 복사
COPY --from=build /client/dist /client/dist

# 간단한 HTTP 서버 설치
RUN npm install -g serve

# 빌드된 출력 파일 제공
CMD ["serve", "-s", "dist", "-l", "3000"]
