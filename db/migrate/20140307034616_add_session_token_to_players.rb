class AddSessionTokenToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :session_token, :string
  end
end
