class ConversationsController < ApplicationController
  def thank_you
    if thread_id = params[:thread_id]
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest_one
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
