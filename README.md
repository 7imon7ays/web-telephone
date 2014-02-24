# README

www.theworldsbiggestgameoftelephoneever.com


## About

This is a web port of the party game Telephone, sometimes known as Paper Telephone or Telephone Pictionary.

In the analog version, the first player draws something on a page and passes it on to the next player. That player then describes the picture in writing, either on a separate piece of paper or on a fold of the same page so that the original drawing cannot be seen. A third player then draws what the second player has described, without looking at the first player's submission. This goes on until everyone has contributed either a drawing or a description and the chain of drawn and written prompts is finally unfolded.

In this version anyone can visit the site and contribute based on a prompt left by a previous user. The game allows infinitely many threads to branch out from one another. A player can make a contribution and send that as a prompt to another player. If someone else makes a submission for the same prompt before the recipient does, the current thread splits into two branches.


## Setup

To refresh the db:

	rake db:drop
	rake db:create
	rake db:migrate
	rails c
	Conversation.create!
	exit

To seed some locations:

	rake db:seed
	rails c
	Contribution.all.each { |c| c.author_id = 3; c.save }
	exit
