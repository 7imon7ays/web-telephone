class ConversationsController < ApplicationController
  def show
    if params[:key]
      thread_id = params[:key].match(/\d+/).to_s.to_i
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest_one
    end
  end
end
