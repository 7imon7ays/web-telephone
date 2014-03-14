class Conversation < ActiveRecord::Base
  has_many :contributions, -> { order(:created_at) },
    class_name: Contribution, foreign_key: :thread_id

  def self.with_associations
    includes(contributions: :author)
  end

  # Join conversations on contributions and flags
  # map flags to contributions and contributions to conversations
  # keep conversations where the count of all flags' unique contribution_ids is less than 3
  def self.censored
    joins(contributions: :flags)
    .group("conversations.id, contributions.thread_id, flags.contribution_id")
    .having("count(flags.contribution_id) < 3")
  end

  # Join conversations on contributions
  # map contributions to conversations
  # order by the number of unique thread_ids in the list of contributions
  # limit to n results
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
          flags: { only: :id },
            author: { only: [:location, :longitude, :latitude] }
          }
        }
      }
    }
    super(options.merge(include_contribution_options))
  end
end
