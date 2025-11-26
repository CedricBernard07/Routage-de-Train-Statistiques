FROM php:8.3-cli
WORKDIR /app
COPY public /app/public
COPY src /app/src
COPY data /app/data
COPY storage /app/storage
EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
