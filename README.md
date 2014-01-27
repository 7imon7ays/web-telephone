# README

## Setup

After installing the bundle, run

    rails g figaro:install

To POST and GET from your AWS bucket, add your Amazon public access key and secret key to config/application.yml under AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Also specify the
name of your S3 bucket under AWS_BUCKET_NAME.

You'll also need to encode a policy document to enable CORS (cross-origin resrouce sharing) with AWS. For now I'm doing that with a policy document ruby object, also ignored by git.

See instructions for using CORS with AWS http://aws.amazon.com/articles/1434

## TODO

* Sanitize plain text in prompt
* Branch out when assigned parent is already taken
* Build contributions index page / thread show page
* Thread picking logic:
  * Make # of eligible threads inversely proprotional to # of childless prompts

