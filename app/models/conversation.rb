class Conversation < ActiveRecord::Base
  has_many :contributions, -> { order(:created_at) },
    class_name: Contribution, foreign_key: :thread_id

  def as_json(options = {})
    contributions.each do |ctb|
      ctb.blob.force_encoding('UTF-8') if ctb.category == "sentence"
    end

    include_options = {
      include: { contributions:
        { include:
          {
          flags: { only: :id },
            author: { only: [:location, :longitude, :latitude] }
          }
        }
      }
    }
    super(options.merge(include_options))
  end

  def self.longest
    Conversation.joins(:contributions)
      .group("conversations.id")
      .order("max(contributions.rank) DESC")
      .limit(1).first
  end
end
