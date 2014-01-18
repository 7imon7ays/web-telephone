class RenameContributionContributorRelation < ActiveRecord::Migration
  def change
    rename_column :contributions, :contributor_id, :author_id
  end
end
