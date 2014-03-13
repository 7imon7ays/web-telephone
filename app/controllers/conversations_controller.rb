class ConversationsController < ApplicationController
  def index
    if thread_id = params[:thread_id]
      @thread = Conversation.with_associations.find(thread_id)
    else
      @thread = Conversation.with_associations.longest_one
    end

    @new_contribution_id = params[:contribution_id]

    @flagged_contributions = current_player ?
      current_player.flagged_contributions : {}
  end

  def show
    @thread = Conversation.with_associations.find(params[:id])
    render json: @thread
  end
end
