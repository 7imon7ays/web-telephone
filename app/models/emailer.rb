class Emailer < ActiveRecord::Base
  validates :contribution, :address, presence: true

  belongs_to :contribution
  belongs_to :player
end
