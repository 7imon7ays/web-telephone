module ContributionHelper
  def s3_prefix
    "https://s3.amazonaws.com/" + ENV["AWS_BUCKET_NAME"] + "/contributions/"
  end
end
