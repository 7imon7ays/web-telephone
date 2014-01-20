class AddS3IdsToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :s3_id, :string, null: false, unique: true
  end
end
