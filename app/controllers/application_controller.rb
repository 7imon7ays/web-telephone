class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def pick_thread_id
    top_thread_ids.sample
  end

  def top_thread_ids
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
end
