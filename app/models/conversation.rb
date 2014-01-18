class Conversation < ActiveRecord::Base
  has_many :contributions, class_name: Contribution, foreign_key: :thread_id
end
