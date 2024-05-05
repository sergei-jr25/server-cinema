# Используем базовый образ Python
FROM node

# Задаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости приложения
COPY  package*.json ./
RUN npm install  

# Копируем исходный код приложения в контейнер
 COPY . .

EXPOSE 5000



# Команда для запуска приложения при старте контейнера
CMD ["npm", "start]