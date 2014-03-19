class EmailersController < ApplicationController
  def create
    @emailer = Emailer.new(contribution_params)
    @emailer.player = current_player || register_new_visitor!

    if @emailer.valid?
      render json: @emailer
    else
      render json: @emailer.errors.full_messages, status: 422
    end
  end

  private

  def contribution_params
    params.require(:emailer).permit(
      :address, :contribution_id
    )
  end
end
