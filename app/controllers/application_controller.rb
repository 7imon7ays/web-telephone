class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def register_new_visitor!
    new_token = SecureRandom::base64(32)
    cookies.permanent[:token] = new_token
    @current_player = Player.create!(cookie: new_token, ip_address: request.remote_ip)
  end

  def update_player_location!
    request.remote_ip == current_player.ip_address ?
    current_player : current_player.save!(ip_address: request.remote_ip)
  end

  def current_player
    return nil if cookies.permanent[:token].nil?
    @current_player ||= Player.find_by_cookie(cookies.permanent[:token])
  end
end
