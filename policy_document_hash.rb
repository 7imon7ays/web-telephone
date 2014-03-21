class PolicyDocument
  attr_reader :encoded_policy_document, :signature
  def initialize
    policy_document = { expiration: "20015-01-01T00:00:00Z",
     conditions: [
       { bucket: ENV["AWS_BUCKET_NAME"] },
       ["starts-with", "$key", "contributions/"],
       { acl: "public-read" },
       { success_action_redirect: "http://localhost:3000/thank-you" },
       ["starts-with", "$Content-Type", ""],
       ["content-length-range", 0, 1048576]
     ]
    }

    policy_doc_json = policy_document.to_json

    access_key = ENV["AWS_SECRET_ACCESS_KEY"]

    @encoded_policy_document = Base64.encode64(policy_doc_json).gsub("\n", "")
    @signature = Base64.encode64(
      OpenSSL::HMAC.digest(
          OpenSSL::Digest::Digest.new('sha1'),
          ENV["AWS_SECRET_ACCESS_KEY"], @encoded_policy_document)
    ).gsub("\n","")
  end
end