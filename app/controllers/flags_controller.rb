class FlagsController < ApplicationController
  def create
    @flag = Flag.new(flag_params)
    @player = Player.find_or_create_by_ip(request.remote_ip)
    @flag.player = @player

    if @flag.save
      session[:flags] ||= Set.new
      session[:flags].add @flag.id.hash
      render json: @flag
    else
      render json: @flag.errors.full_messages, status: 422
    end
  end

  def destroy
    @flag = Flag.find(params[:flag_id])

    user_is_authorized = session[:flags].include? @flag.id.hash ||
      request.remote_ip == @flag.player.ip_address

    if !user_is_authorized
      render json: @flag, status: 401
    elsif @flag.destroy
      render json: "Flag destroyed"
    else
      render @flag.errors.full_messages, status: 422
    end
  end

  private

  def flag_params
    params.require(:flag).permit(:contribution_id)
  end
end
