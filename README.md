# README

www.theworldsbiggestgameoftelephoneever.com

## About

This is a web port of the party game Telephone, sometimes known as Paper
Telephone or Telephone Pictionary.

Read the rules [here][telephone rules].

[telephone rules]: http://www.campgames.org/game/paper-telephone

In the web version anyone visits the site and contributes based on a prompt
left by a previous user. The game allows any thread to branch out into
infinitely many new threads. Players can also send their submissions as a
prompt to someone else. After contributing, players scroll down the list of
their thread's prior contributions and hilarity ensues.

## Reception

The World's Biggest Game of Telephone Ever(.com) was picked up by a
[number][escapist] of [online forums][internet is beautiful] and some die-hards
even gave it a [subreddit][subreddit]. It hit 100, 000 submissions within a
week of its launch. Unfortunately, many (most?) of those were PG-13.

The World's Biggest Game of Telephone Ever(.com) is currently on hold while its
creators think of ways to moderate it at scale.

[escapist]: https://www.facebook.com/EscapistMag/posts/10152362390939591
[internet is beautiful]: http://www.reddit.com/r/InternetIsBeautiful/comments/248xxj/the_biggest_game_of_telephone_on_the_internet_if/
[subreddit]: http://www.reddit.com/r/TWBGoTE/comments/2ho3zg/i_miss_this_game/

## Performance

The World's Biggest Game of Telelphone Ever(.com) had to evolve to stay snappy.
Here's what changed over time.

**Background Jobs**

User submissions are geocoded. They also trigger an email if the user whose
prompt they're responding to chose that option. These are both slow processes
so The World's Biggest Game of Telelphone Ever(.com) uses [Delayed Job][delayed job]
to run those in the background without interrupting the user's experience.

[delayed job]: https://github.com/collectiveidea/delayed_job

**Unicorn**

Switched the server from Thin to Unicorn. Unicorn requires more configuration
but allows the app to scale memory usage when simultaneous requests come in.
That was a big improvement because Thin was dropping too many requests.

**Efficient DB Querying**

Whenever you navigate to The World's Biggest Game of Telelphone Ever(.com), the
app pulls up a prior submission to prompt you with. Under the hood it's running
through all previous threads, finding the longest ones--excluding the last one
you were shown-- and returning the most recent contributions that have not yet
been flagged as inapropriate.  These would be simple instructions in an
imperative Ruby script, but that would mean opening several connections to the
database and iterating over some long arrays in plain Ruby. Since this query
runs for every visitor, it had to confined to one database connection. See the
results [here][contribution model].

[contribution model]: https://github.com/7imon7ays/web-telephone/blob/master/app/models/contribution.rb

