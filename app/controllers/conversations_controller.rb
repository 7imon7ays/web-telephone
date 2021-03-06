class ConversationsController < ApplicationController
  def index
    if thread_id = params[:thread_id]
      @thread = Conversation.find(thread_id)
    else
      @thread = Conversation.longest
    end

    if params[:contribution_id]
      @new_contribution = Contribution.find(params[:contribution_id])
      @player_is_author = current_player &&
        @new_contribution.author_id == current_player.id
      @no_emailer_added = !@new_contribution.observers.include?(current_player)
    end

    @flagged_contributions = current_player.try(:flagged_contributions) || {}
  end
end

