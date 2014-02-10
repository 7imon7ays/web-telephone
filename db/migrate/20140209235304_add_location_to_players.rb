class AddLocationToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :location, :string
  end
end
