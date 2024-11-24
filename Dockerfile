# 使用支援 Next.js 的 Node.js 版本
FROM node:18.17.0 AS builder

# 設置工作目錄
WORKDIR /usr/src/app

# 複製依賴文件
COPY package.json package-lock.json ./


# 安裝依賴
ENV NODE_ENV=production
# 安裝生產和開發依賴
RUN npm install

# 複製項目代碼
COPY . .

# 構建應用
RUN npm run build

# （可選）使用更小的映像檔來運行應用程式
FROM node:18.17.0 AS runner




# 設置環境變數（可選，視需求調整）
ENV NODE_ENV=production

# 設置工作目錄
WORKDIR /usr/src/app

# 複製必要的文件到運行階段
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/next.config.mjs ./next.config.mjs

# 暴露應用的默認端口
EXPOSE 3000

# 運行應用
CMD ["npm", "start"]