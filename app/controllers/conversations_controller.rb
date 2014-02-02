class ConversationsController < ApplicationController
  def show
    thread_id = params[:key].match(/\d/).to_s.to_i
    @thread = Conversation.find(thread_id)
  end
end
