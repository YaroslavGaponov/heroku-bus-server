Heroku bus server
===========

MQ Broker for Heroku based on long polling technology.

Deploy to Heroku
=====
`
heroku login
git init
git add -am 'init'
git push heroku master
`


Test
=====

Subcribe on new message
`
curl -XGET  http://stormy-gorge-8934.herokuapp.com/topic/test
`

Consumer
`
curl -XPOST  http://stormy-gorge-8934.herokuapp.com/topic/test -d '{ "message": "Hello world!!!" }' -H "Content-Type: application/json"
`
