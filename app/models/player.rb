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
  after_create :delayed_geocode
  after_update :delayed_geocode, if: :ip_address_changed?

  has_many :contributions, foreign_key: :author_id
  has_many :emailers, dependent: :destroy
  has_many :flags

  def flagged_contributions
    Hash[flags.map { |flag| [flag.contribution_id, flag.id] }]
  end

  def delayed_geocode
    Delayed::Job.enqueue GeocodePlayerJob.new(self)
  end
end
