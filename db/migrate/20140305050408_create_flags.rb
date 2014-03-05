class CreateFlags < ActiveRecord::Migration
  def change
    create_table :flags do |t|
      t.integer :contribution_id, null: false
      t.integer :player_id, null: false
      t.index :contribution_id

      t.timestamps
    end
  end
end
