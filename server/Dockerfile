# Node.js 22 이미지 기반
FROM node:22 AS base

# SSH 클라이언트 설치
RUN apt-get update && apt-get install -y openssh-client

# 애플리케이션 파일 복사 및 의존성 설치
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm install

# 애플리케이션 파일 복사
COPY . . 

# SSH 및 애플리케이션 실행
CMD ["sh", "-c", "echo \"$SSH_PRIVATE_KEY\" > /root/.ssh/id_rsa && chmod 400 /root/.ssh/id_rsa && ssh-keyscan -H ${SSH_REMOTE_HOST} >> /root/.ssh/known_hosts && ssh -i /root/.ssh/id_rsa -f -N -L ${SSH_LOCAL_PORT}:${RDS_HOST}:${SSH_REMOTE_PORT} ${SSH_REMOTE_USER}@${SSH_REMOTE_HOST} && npm start"]
