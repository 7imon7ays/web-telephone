class ConversationsController < ApplicationController
  def show
    if params[:thread_id]
      thread_id = params[:thread_id]
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest_one
    end
  end
end
