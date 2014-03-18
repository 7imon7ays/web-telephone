class ConversationsController < ApplicationController
  def index
    if current_player.nil?
      register_new_visitor!
    end

    if thread_id = params[:thread_id]
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest
    end

    if params[:contribution_id]
      @new_contribution = Contribution.find(params[:contribution_id])
    end

    @flagged_contributions = current_player.flagged_contributions
  end
end
