class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :ip_address, null: false
      t.index :ip_address

      t.timestamps
    end
  end
end
