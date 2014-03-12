class FlagsController < ApplicationController
  def create
    @flag = Flag.new(flag_params)
    @flag.player = current_player || Player.create!(
        cookie: SecureRandom::base64(32), ip_address: request.remote_ip
    )

    if @flag.save
      render json: @flag
    else
      render json: @flag.errors.full_messages, status: 422
    end
  end

  def destroy
    @flag = Flag.find(params[:id])
    player_is_registered_and_authorized =
      current_player && @flag.player_id == current_player.id

    if !player_is_registered_and_authorized
      render json: "Unauthorized!", status: 401
    elsif @flag.destroy
      contribution_id = @flag.contribution_id
      render json: contribution_id
    else
      render @flag.errors.full_messages, status: 422
    end
  end

  private

  def flag_params
    params.require(:flag).permit(:contribution_id)
  end
end
