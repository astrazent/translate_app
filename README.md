## Usage
set up database:
C1: 
- set up database theo như file mysql.yml (có thể dùng mysql hay bất cứ hệ quản trị nào)

C2:
B1: tải Dbeaver: https://dbeaver.io/
++ tạo connection trong dbeaver:
PORT:3307
username / password: root / 123456
B2: tải docker: https://www.docker.com/
- để chạy docker:
++ tạo folder trống
++ kéo file mysql.yml vào đó
++ mở docker desktop
++ mở cmd tại folder đó và chạy lệnh:
### docker compose -f mysql.yml -p nodejs-sql up -d


Chạy dự án nodejs:

B1: 
- cài nodejs: https://nodejs.org/en 

B2: Mở terminal trong vscode:
### npm install 
- cài package cần

### npm run dev 
- chạy chương trình, vào địa chỉ http://localhost:8080/ 

## Contributing

Nhóm 8 WEB

## License

[MIT](https://choosealicense.com/licenses/mit/)
https://youtu.be/CKJHcupx6xk?si=ZWE-PjX2XoaK2g8_
