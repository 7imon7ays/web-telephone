class Flag < ActiveRecord::Base
  validates :player_id, :contribution_id, presence: true
  validates_uniqueness_of(:contribution_id,
            scope: :player_id, message: "already has a flag from you!")

  belongs_to :contribution
  belongs_to :player
end
