class AddSignatureToContributions < ActiveRecord::Migration
  def change
    add_column :contributions, :signature, :string
  end
end
