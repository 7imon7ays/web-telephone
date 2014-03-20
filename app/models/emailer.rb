class Emailer < ActiveRecord::Base
  validates :contribution, :address, presence: true

  belongs_to :contribution
  belongs_to :player

  def deliver
    PlayerMailer.new_child_email(self).deliver
  end
  handle_asynchronously :deliver
end
