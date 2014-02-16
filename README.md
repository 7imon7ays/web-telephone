# README

## Setup

Install:

    bundle install
    rails g figaro:install

To refresh the db:

	rake db:drop
	rake db:create
	rake db:migrate
	rails c
	Conversation.create!
	exit


## TODO

* Build out front end validations
* Redirect to thank you page via javascript instead of server for better error notices
* Sanitize plain text in prompt
* Branch out when assigned parent is already taken
* Build contributions index page / thread show page
* Thread picking logic:
  * Make # of eligible threads inversely proprotional to # of childless prompts
* WRITE TESTS
