class Conversation < ActiveRecord::Base
  has_many :contributions, -> { order(:created_at) },
    class_name: Contribution, foreign_key: :thread_id

  def self.with_associations
    includes(contributions: :author)
  end

  def self.longest(n = 1)
    joins(:contributions)
    .group("conversations.id, contributions.thread_id")
    .order("count(contributions.thread_id) DESC")
    .limit(n)
  end

  def self.longest_one
    longest.first
  end

  def as_json(options = {})
    include_contribution_options = {
      include: { contributions:
        { include:
          {
          flags: { only: [:id, :contribution_id] },
            author: { only: [:location, :longitude, :latitude] }
          }
        }
      }
    }
    super(options.merge(include_contribution_options))
  end
end
