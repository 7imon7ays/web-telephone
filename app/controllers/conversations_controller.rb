class ConversationsController < ApplicationController
  def thank_you
    if thread_id = params[:thread_id]
      @thread = Conversation.with_associations.find(thread_id)
    else
      @thread = Conversation.with_associations.longest_one
    end
    @flagged_contributions = current_player ?
      current_player.flagged_contributions : {}

    @this_contribution = @thread.contributions.max_by{|last| last["id"]}
  end


  def show
    @thread = Conversation.with_associations.find(params[:id])
    render json: @thread
  end
end
