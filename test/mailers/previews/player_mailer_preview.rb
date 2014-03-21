class PlayerMailerPreview < ActionMailer::Preview
  def new_child_email
    emailer = Emailer.first
    new_child = emailer.contribution.children.first
    PlayerMailer.
      new_child_email(Emailer.first, new_child)
  end
end

