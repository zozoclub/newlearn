# Node.js 20 버전 이미지 기반 새로운 이미지 생성
FROM node:20

# 컨테이너 내 작업할 디렉토리 설정
WORKDIR /app

# package.json, package-lock.json 컨테이너에 복사
COPY package*.json ./

RUN rm -rf node_modules

# 의존성 설치
RUN npm ci

# 나머지 파일 컨테이너에 복사
COPY . .

# 빌드 실행
RUN npm run build

CMD ["npm", "run", "start"]