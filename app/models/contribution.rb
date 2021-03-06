class Contribution < ActiveRecord::Base
  attr_accessor :empty_canvas_value

  CATEGORIES = ["picture", "sentence"]

  validates :category, inclusion: CATEGORIES
  validates :author, :thread, :blob, presence: true
  validates_uniqueness_of :parent_id, scope: :thread_id
  validates_uniqueness_of :rank, scope: :thread_id
  validate(:blob_is_not_default, :blob_is_not_dangerous,
           :signature_is_not_blank, :signature_is_not_dangerous)

  belongs_to :author, class_name: Player, foreign_key: :author_id
  belongs_to :thread, class_name: Conversation, foreign_key: :thread_id
  belongs_to :parent, class_name: Contribution, foreign_key: :parent_id
  has_many :children, class_name: Contribution, foreign_key: :parent_id
  has_many :flags, dependent: :destroy
  has_many :emailers, dependent: :destroy
  has_many :observers, through: :emailers, source: :player

  before_validation :set_thread, :set_rank, on: :create

  def self.ancestors_of(contribution)
    Contribution.where(thread_id: contribution.thread_id)
    .where("rank <= ?", contribution.rank)
    .includes(:author)
  end

  def set_associations(options = {})
    self.parent = pick_parent(options)
    self.category = pick_category
    self
  end

  private

  def pick_parent(options = {})
    if parent_id && parent = Contribution.find_by_id(parent_id)
      return parent
    end

    self.class.find_by_sql([eligible_parents, {
      last_thread_id: options[:last_thread_id], flag_limit: 3, sample_size: 3
    }]).sample
  end

  # Hmmm yeah
  def eligible_parents
    <<-SQL
    WITH max_rank_per_thread AS (
      SELECT conversations.id AS thread_id, max(contributions.rank) AS max_rank
      FROM conversations
      JOIN contributions ON contributions.thread_id = conversations.id
      GROUP BY conversations.id
      HAVING conversations.id IS DISTINCT FROM :last_thread_id
      ORDER BY max_rank DESC
      LIMIT :sample_size
    )
    SELECT contributions.*
    FROM contributions
    JOIN max_rank_per_thread ON max_rank_per_thread.thread_id = contributions.thread_id
    AND contributions.rank = max_rank_per_thread.max_rank
    LEFT JOIN flags ON contributions.id = flags.contribution_id
    GROUP BY contributions.id
    HAVING count(flags.contribution_id) < :flag_limit
    SQL
  end

  def pick_category
    ( (!!parent && parent.category == CATEGORIES.first) ?
          CATEGORIES.last : CATEGORIES.first )
  end

  def set_thread
    self.thread_id = parent_thread_available? ?
      parent.thread_id : Conversation.create!.id
  end

  def parent_thread_available?
    parent_id && parent.children.none?
  end

  def set_rank
    parent = Contribution.find_by_id(self.parent_id)
    self.rank = ( parent ? parent.rank + 1 : 1 )
  end

  def blob_is_not_default
    if blob == "" || blob == empty_canvas_value
      errors.add(:submission, "can't be left blank!")
    end
  end

  def blob_is_not_dangerous
    if blob != Sanitize.clean(blob)
      errors.add(:submission, "contains restricted elements!")
    end
  end

  def signature_is_not_blank
    errors.add(:signature, "can't be a blank!") if signature && signature == ""
  end

  def signature_is_not_dangerous
    if signature != Sanitize.clean(signature)
      errors.add(:signature, "contrains restricted elements!")
    end
  end
end

