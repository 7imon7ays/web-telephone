class MakeEmailersAuthTokenNotNull < ActiveRecord::Migration
  def change
    change_column :emailers, :auth_token, :string, null: false
  end
end
