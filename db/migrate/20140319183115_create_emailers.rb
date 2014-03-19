class CreateEmailers < ActiveRecord::Migration
  def change
    create_table :emailers do |t|
      t.string :address, null: false
      t.integer :contribution_id, null: false
      t.integer :player_id

      t.timestamps
    end
  end
end
