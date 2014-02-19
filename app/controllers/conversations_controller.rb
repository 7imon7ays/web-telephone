class ConversationsController < ApplicationController
  def thank_you
    eager_loaded_conversation = Conversation.includes(contributions: :author)
    if thread_id = params[:thread_id]
      @thread = eager_loaded_conversation.find(thread_id)
    else
      @thread = eager_loaded_conversation.longest_one
    end
  end

  def show
    @thread = Conversation.find(params[:id])
    render json: @thread
  end

  def for_contribution
    @contribution = Contribution.find(params[:id])
    render json: @contribution.thread
  end
end
