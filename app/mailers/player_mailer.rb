class PlayerMailer < ActionMailer::Base
  default from: "thetelephoneoperators@gmail.com"

  def new_child_email(emailer, new_child)
    @emailer = emailer
    @contribution = emailer.contribution
    @new_child = new_child
    mail(to: emailer.address, subject: "Your voice was heard!")
  end
end

