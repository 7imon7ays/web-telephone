class PlayerMailer < ActionMailer::Base
  default from: "thetelephoneoperators@gmail.com"

  def new_child_email(emailer)
    @parent = emailer.contribution
    mail(to: emailer.address, subject: "Your voice was heard!")
  end
end
