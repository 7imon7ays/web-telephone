class AddContributorIdToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :contributor_id, :integer, null: false
  end
end
