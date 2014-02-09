class Player < ActiveRecord::Base
  geocoded_by :ip_address, :latitude => :latitude, :longitude => :longitude

  validates :ip_address, presence: true
  after_validation :geocode, if:  lambda { |obj| obj.ip_address_changed? }

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
