 
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
