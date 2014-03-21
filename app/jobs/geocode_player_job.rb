class GeocodePlayerJob < Struct.new(:player)
  def perform
    player.geocode
    player.reverse_geocode
    player.save!
  end
end

