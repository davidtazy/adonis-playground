 
 # create project

   sudo apt update && sudo apt upgrade
 # instal node
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   node --version
   npm -v

 # create adonis project web
   npm init  adonisjs@latest adonis-playground
   cd adonis-playground/
   npm run dev
 
 # adonisjs installation
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

 # install markdown 
   npm i @dimerapp/markdown

 # create movie service
   node ace make:service movies

 # create movie controller
   node ace make:controller movies index show

# create movie model
   node ace make:model movie

# install redis 
   npm i @adonisjs/redis

 node ace configure @adonisjs/redis

# run redis server
docker run --name redis-dev -p 6379:6379 -d redis:latest


# create redis controller to delete slug or flush redis cache
node ace make:controller redis


# share global (option:true)
node ace make:preload globals data flow

# icon set
npm i edge-iconify
npm i @iconify-json/ph

#postgres db
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydatabase \
  -v /path/to/your/local/directory:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:latest

# add posgres driver
node ace configure @adonisjs/lucid --db=postgresv #update files =true

node ace make:migration roles
node ace make:migration movie_statuses
node ace make:migration movies
node ace make:migration cineasts
node ace make:migration crew_movies
node ace make:migration cast_movies

# to see the migration status
node ace migration:status

# to execute pending migration
node ace migration:run

# install pg client
sudo apt install postgresql-client

# connect to the db
psql -h localhost -U myuser -d mydatabase # enter the password the exectute the command '\dt'  to list tables

# create models
 node ace make:model roles
 node ace make:model movie_statuses
 node ace make:model --help
 node ace make:model cineasts

# create seeds
node ace make:seeder start
node ace db:seed # error if tables already filled
node ace migration:refresh # remove all tables and recreate them
node ace db:seed