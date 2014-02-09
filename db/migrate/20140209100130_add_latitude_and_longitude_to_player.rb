class AddLatitudeAndLongitudeToPlayer < ActiveRecord::Migration
  def change
    add_column :players, :latitude, :float
    add_column :players, :longitude, :float
  end
end
