class Conversation < ActiveRecord::Base
  has_many :contributions, class_name: Contribution, foreign_key: :thread_id

  def self.longest(n = 1)
    joins(:contributions)
    .group("conversations.id, contributions.thread_id")
    .order("count(contributions.thread_id) DESC")
    .limit(n)
  end

  def self.longest_one
    longest.first
  end

  # Useless for now
  def self.s3_connection
    @s3_connection ||= AWS::S3.new(access_key_id: ENV["AWS_ACCESS_KEY_ID"],
      secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"])    
  end

  def as_json(options = {})
    super(options.merge({ include: :contributions }))
  end
end
