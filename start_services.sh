#! /bin/sh

docker run --name redis-dev \
  -p 6379:6379 \
  -d redis:latest

docker run --name postgres-dev \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydatabase \
  -v ./tmp/postgres:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:latest