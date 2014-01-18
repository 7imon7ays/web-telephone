class AddThreadAndParentKeysToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :parent_id, :integer
    add_column :contributions, :thread_id, :integer, null: false
  end
end
