class CreateContributions < ActiveRecord::Migration
  def change
    create_table :contributions do |t|
      t.string :category, null: false

      t.timestamps
    end
  end
end
