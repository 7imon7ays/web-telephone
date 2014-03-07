class RenameSessionTokensToCookies < ActiveRecord::Migration
  def change
    rename_column :players, :session_token, :cookie
  end
end
