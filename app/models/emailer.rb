class Emailer < ActiveRecord::Base
  validates :contribution, :address, :auth_token, presence: true
  validates :contribution, uniqueness: { scope: :address,
     message: "already registered with that address" }

  belongs_to :contribution
  belongs_to :player

  before_validation :set_auth_token, on: :create

  def deliver(new_child)
    PlayerMailer.new_child_email(self, new_child).deliver
  end
  handle_asynchronously :deliver

  private

  def set_auth_token
    self.auth_token = SecureRandom.hex
  end
end

