# README

## Setup

After installing the bundle, run

    rails g figaro:install

To POST and GET from your AWS bucket, add your Amazon public access key and secret key to config/application.yml under AWS_PUBLIC_KEY and AWS_SECRET_KEY.

You'll also need to encode a policy document to enable CORS (cross-origin resrouce sharing) with AWS. For now I'm doing that with a policy document ruby object, also ignored by git.

See instructions for using CORS with AWS http://aws.amazon.com/articles/1434

## TODO

* Display picture of image prompt
* Thread picking logic:
  * Make # of eligible threads inversely proprotional to # of childless prompts
