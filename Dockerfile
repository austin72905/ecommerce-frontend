# 使用Node.js的LTS版本作為基礎映像
FROM node:16 AS builder

# 設置工作目錄
WORKDIR /usr/src/app

# 複製依賴文件
COPY package.json package-lock.json ./

# 安裝生產和開發依賴
RUN npm install

# 複製項目代碼
COPY . .

# 構建應用
RUN npm run build

# 第二階段：運行階段
FROM node:16 AS runner

# 設置環境變數（可選，視需求調整）
ENV NODE_ENV=production

# 設置工作目錄
WORKDIR /usr/src/app

# 複製必要的文件到運行階段
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

# 暴露應用的默認端口
EXPOSE 3000

# 運行應用
CMD ["npm", "start"]