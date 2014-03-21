class AddAuthTokensToEmailers < ActiveRecord::Migration
  def change
    add_column :emailers, :auth_token, :string
  end
end

