 
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

# create factory and fake seeders
node ace make:factory cineast
node ace make:seeder fake
node ace db:seed

node ace make:factory movie
node ace make:factory user

node ace migration:refresh

node ace db:seed --files  ./database/seeders/fake_seeder.ts
node ace db:seed --files  ./database/seeders/fake_seeder.ts

# alter database
node ace make:migration alter_cast_movies_add_sort_order --alter
node ace migration:status
node ace migration:run #create batch 2
#node ace migration:rollback will remove batch2


node ace repl
# > await loadDb()
# > await loadModels()
# > (await db.rawQuery('SELECT * FROM movies WHERE ?? = ?',['id',1])).rows
# > (await db.rawQuery('SELECT * FROM movies WHERE :column: = :value', {column:'id',value:3}  )).rows
# > await models.movie.query().whereRaw('?? = ?',['id',1]).pojo()

node ace db:seed --files=database/seeders/fake_seeder_released_movies.ts
node ace repl
# > await loadModels()
# > await models.movie.query().withScopes(scope => scope.released()).pojo()
# > await models.movie.query().withScopes(scope => scope.released()).where('title','Loving You').pojo()

node ace migration:reset
node ace migration:run
node ace db:seed

node ace migration:refresh --seed

node ace repl
# > await loadModels()
# > await models.movie.create({statusId:1,writerId:1,directorId:1,title:'Tossing & Turning'})
# > await models.movie.create({statusId:1,writerId:1,directorId:1,title:'Tossing & Turning'})
# should add the suffix '-1' to ensure slug unicity


 node ace migration:refresh --seed

node ace repl
# > await loadModels()
# > const user= await models.user.findOrFail(1)
# > await user.related('profile').query().pojo() // show the linked profile
# > await user.load('profile')  // profile is 'lazy loaded'
# > user.profile.description  // print the description

# > const user2 = await models.user.query().where('id',1).preload('profile').firstOrFail() //eager loading
# >  user.profile.description  // print the description

# > const users = await models.user.query().preload('profile') //eager loading all users
# > (js) users.length
# 5
# > (js) users.at(4).profile.description
