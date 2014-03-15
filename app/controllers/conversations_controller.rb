class ConversationsController < ApplicationController
  def index
    if current_player.nil?
      register_new_visitor!
    end

    if thread_id = params[:thread_id]
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest_one
    end

    @new_contribution_id = params[:contribution_id]

    @flagged_contributions = current_player.flagged_contributions
  end

  def show
    @thread = Conversation.with_associations.find(params[:id])
    render json: @thread
  end
end
