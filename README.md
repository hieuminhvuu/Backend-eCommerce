## Build and Run Project
```
git clone ...
npm install
npm run dev
```

## Tech Stack

- [x] Swagger or OpenApi
- [x] Logger
- [x] Mongodb
- [x] Caching with redis
- [x] Unit test
- [x] RabbitMq
- [x] Security with public key, private key, token jwt
- [x] Upload images with S3 and CloudDinary
- [x] Public and Protect url with AWS CloudFront
- [ ] Email
- [ ] Notify with firebase or socketIo
- [ ] Dockerfile, docker-compose for dev and test
- [ ] Deployment with jenkins or circleCI
- [ ] Unit test


## Setup lib project
    - "@aws-sdk/client-s3": "^3.496.0",
    - "@aws-sdk/cloudfront-signer": "^3.521.0",
    - "@aws-sdk/s3-request-presigner": "^3.498.0",
    - "accesscontrol": "^2.2.1",
    - "amqplib": "^0.10.3",
    - "bcrypt": "^5.1.1",
    - "cloudinary": "^1.41.0",
    - "cors": "^2.8.5",
    - "crypto": "^1.0.1",
    - "dotenv": "^16.3.1",
    - "express": "^4.18.2",
    - "jsonwebtoken": "^9.0.2",
    - "kafkajs": "^2.2.4",
    - "lodash": "^4.17.21",
    - "mongoose": "^7.6.3",
    - "multer": "^1.4.5-lts.1",
    - "mysql2": "^3.6.5",
    - "redis": "^4.6.10",
    - "slugify": "^1.6.6",
    - "swagger-jsdoc": "^6.2.8",
    - "swagger-ui-express": "^5.0.0",
    - "uuid": "^9.0.1",
    - "winston-daily-rotate-file": "^5.0.0"

## Mongodb
    - Nhược điểm của cách connect cũ
    - Cách connect mới, khuyên dùng
    - Kiểm tra hệ thống có bao nhiêu connect
    - THông báo khi server quá tải connect
    - Có nên disConnect liên tục hay không?
    - PoolSize là gì? vì sao lại quan trọng?
    - Nếu vượt quá kết nối poolsize?
    - MongoDB Desing pattern


### Api key
    - Lưu trữ key cung cấp cho các đối tác được truy cập vào hệ thống

### Design Schema MongoDB - Polymorphic Pattern
    - 1document 1kb -> 50tr = 50gb

### FullText search in mongoDB
[Link research](https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379)

### Swagger UI
```
npm install swagger-ui-express swagger-jsdoc --save
```
- Start project and check in link : localhost:port/api-docs

### Logger
```
npm i winston express-winston winston-mongodb
npm i winston-daily-rotate-file --save
```
[Logger Nodejs - Link research](https://anonystick.com/blog-developer/logger-nodejs-la-gi-su-dung-winston-la-phai-chuyen-nghiep-nhu-the-nay-202010099590776)



Updating...