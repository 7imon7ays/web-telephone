class Conversation < ActiveRecord::Base
  has_many :contributions, class_name: Contribution, foreign_key: :thread_id
  
  def self.top_thread_ids
    # TODO Make selection LIMIT depend
    # on the number of childless leaves
    max_contributions_sql = "SELECT id FROM conversations WHERE id IN 
                              (SELECT thread_id FROM contributions
                              GROUP BY thread_id
                              ORDER BY count(thread_id)
                              LIMIT 5);"

    max_contributions_result = ActiveRecord::Base.connection.execute(max_contributions_sql)
    top_thread_ids = max_contributions_result.values.flatten.map(&:to_i)
  end
  
  # Useless for now
  def self.s3_connection
    @s3_connection ||= AWS::S3.new(access_key_id: ENV["AWS_ACCESS_KEY_ID"],
      secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"])    
  end
end
