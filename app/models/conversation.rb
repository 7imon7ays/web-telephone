class Conversation < ActiveRecord::Base
  has_many :contributions, class_name: Contribution, foreign_key: :thread_id

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
          { author: { only: :location } },
        }
      }
    }
    super(options.merge(include_contribution_options))
  end
end
