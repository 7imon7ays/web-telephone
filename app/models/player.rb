class Player < ActiveRecord::Base
  geocoded_by :ip_address, :latitude => :latitude, :longitude => :longitude
  reverse_geocoded_by :latitude, :longitude do |player, results|
  if location_data = results.first
    city = location_data.city
    state_or_country = location_data.state ||
    location_data.country
    player.location = "#{city}, #{state_or_country}"
  end
end

  validates :ip_address, presence: true
  before_save :geocode, :reverse_geocode

  has_many :contributions, foreign_key: :author_id
  has_many :flags

  def self.current(cookies)
    return nil unless token = cookies[:token]
    @current_player ||= self.find_by_cookie(token)
  end

  def self.deferred_register!(cookies, client_ip)
    Thread.new do
      current_player = Player.current(cookies)
      if current_player.nil?
        new_token = SecureRandom::base64(32)
        cookies[:token] = new_token
        Player.create!(cookie: new_token, ip_address: client_ip)
      else
        client_ip == current_player.ip_address ?
          current_player : current_player.save!(ip_address: client_ip)
      end
    end
  end

  def flagged_contributions
    Hash[flags.map { |flag| [flag.contribution_id, flag.id] }]
  end
end
