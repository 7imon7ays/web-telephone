# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140320225235) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "contributions", force: true do |t|
    t.string   "category",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "author_id",  null: false
    t.integer  "parent_id"
    t.integer  "thread_id",  null: false
    t.binary   "blob",       null: false
    t.integer  "rank",       null: false
    t.string   "signature"
  end

  create_table "conversations", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "emailers", force: true do |t|
    t.string   "address",         null: false
    t.integer  "contribution_id", null: false
    t.integer  "player_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "auth_token",      null: false
  end

  create_table "flags", force: true do |t|
    t.integer  "contribution_id", null: false
    t.integer  "player_id",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "flags", ["contribution_id"], name: "index_flags_on_contribution_id", using: :btree

  create_table "players", force: true do |t|
    t.string   "ip_address", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "latitude"
    t.float    "longitude"
    t.string   "location"
    t.string   "cookie"
  end

  add_index "players", ["cookie"], name: "index_players_on_cookie", using: :btree

end
