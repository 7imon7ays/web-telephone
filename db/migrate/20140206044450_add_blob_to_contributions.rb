class AddBlobToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :blob, :binary, null: false
    remove_column :contributions, :s3_id
  end
end
