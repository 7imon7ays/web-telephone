class RemoveIpAddressIndexAndAddCookieIndexOnPlayers < ActiveRecord::Migration
  def change
    remove_index :players, column: :ip_address
    add_index :players, :cookie
  end
end
