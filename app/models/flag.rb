class Flag < ActiveRecord::Base

  validates :player_id, :contribution_id, presence: true
  validates_uniqueness_of(:contribution_id,
            scope: :player_id, message: "You've already flagged this submission.")

  belongs_to :contribution
  belongs_to :player
end