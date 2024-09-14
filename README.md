# NUDDUCK

# nudduck 팀원들을 위한 Docker 배포 가이드

이 문서는 Docker 이미지를 받아와서 컨테이너를 실행하는 방법입니다!

1. Docker 설치
Docker와 Docker Compose가 설치되어 있어야 합니다. Docker 설치 가이드를 참조하여 설치
Docker Desktop을 설치하면 Docker Compose도 함께 설치됩니다. 별도로 설치할 필요가 없습니다!

**Docker Compose가 정상적으로 설치되었는지 확인합니다.**

```bash
docker-compose --version
```

2. Docker 이미지 받아오기
Docker Hub에서 이미지를 받아오기 위해, Docker CLI를 사용하여 이미지를 다운로드

```bash
# 프론트엔드 이미지 다운로드
docker pull remazitensi/nudduck:frontend-latest

# 백엔드 이미지 다운로드
docker pull remazitensi/nudduck:backend-latest
```
3. 환경 변수 파일 준비
각 서비스에 필요한 환경 변수를 설정하려면 .env 파일을 준비
디스코드 공지 스레드에 있는 .env 파일을 받아서 프로젝트 디렉토리에 배치

프론트엔드: client/.env.production

백엔드: server/.env

```bash
# Docker Compose를 사용하여 프론트엔드와 백엔드 컨테이너를 백그라운드에서 실행합니다.
docker-compose up -d
```
6. 컨테이너 상태 확인
실행 중인 컨테이너의 상태를 확인
```bash
docker-compose ps
```
7. 로그 확인
컨테이너의 로그를 확인하여 정상적으로 실행되고 있는지 확인
```bash
docker-compose logs
```
8. 서비스 접근
프론트엔드: 브라우저에서 http://localhost:80에 접속
백엔드: http://localhost:3000 접근