class ConversationsController < ApplicationController
  def thank_you
    if thread_id = params[:thread_id]
      @thread = Conversation.with_associations.find(thread_id)
      @flags = current_player ? current_player.flags : nil
    else
      @thread = Conversation.with_associations.longest_one
    end
  end

  def show
    @thread = Conversation.with_associations.find(params[:id])
    render json: @thread
  end
end
