class AddRankToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :rank, :integer, null: false
  end
end
