class Conversation < ActiveRecord::Base
  has_many :contributions, -> { order(:created_at) },
    class_name: Contribution, foreign_key: :thread_id

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
