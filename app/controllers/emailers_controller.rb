class EmailersController < ApplicationController
  def create
    @emailer = Emailer.new(emailer_params)
    @emailer.player = current_player || register_new_visitor!

    if @emailer.save
      render json: {}
    else
      render json: @emailer.errors.full_messages, status: 422
    end
  end

  def destroy
    @emailer = Emailer.find(params[:emailer_id])
    auth_token = params[:auth_token]

    if @emailer.auth_token == auth_token
      @emailer.destroy
    else
      render json: "Unauthorized!", status: 401
      return
    end
  end

  private

  def emailer_params
    params.require(:emailer).permit(:address, :contribution_id)
  end
end

