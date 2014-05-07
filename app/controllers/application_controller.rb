class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def register_new_visitor!
    new_token = SecureRandom::base64(32)
    cookies.permanent[:token] = new_token
    @current_player = Player.new(cookie: new_token, ip_address: request.remote_ip)
    @current_player.save!
  end

  def update_player_location!
    player_ip_has_changed = request.remote_ip != current_player.ip_address

    if player_ip_has_changed
      current_player.update_attributes!(ip_address: request.remote_ip)
    end
  end

  def current_player
    return nil if cookies.permanent[:token].nil?
    @current_player ||= Player.find_by_cookie(cookies.permanent[:token])
  end

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
