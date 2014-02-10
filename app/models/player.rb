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

  def self.find_or_create_by_ip(ip_address)
    player = find_by_ip_address(ip_address)
    unless player
      player = new(ip_address: ip_address)
      player.save
    end
    player
  end
end
