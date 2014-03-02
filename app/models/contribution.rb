class Contribution < ActiveRecord::Base
  attr_accessor :empty_canvas_value
  CATEGORIES = ["picture", "sentence"]
  validates :category, inclusion: CATEGORIES
  validates :author, :thread, :blob, presence: true
  validates_uniqueness_of :parent_id, scope: :thread_id
  validates_uniqueness_of :rank, scope: :thread_id
  validate :blob_is_not_default, :blob_is_not_dangerous, :signature_is_not_dangerous

  belongs_to :author, class_name: Player, foreign_key: :author_id
  belongs_to :thread, class_name: Conversation, foreign_key: :thread_id
  belongs_to :parent, class_name: Contribution, foreign_key: :parent_id
  has_many :children, class_name: Contribution, foreign_key: :parent_id

  before_validation :branch_out_maybe, :set_rank

  def self.ancestors_of(contribution)
    Contribution.where(thread_id: contribution.thread_id)
    .where("rank <= ?", contribution.rank)
    .includes(:author)
  end

  def set_associations
    self.thread_id = pick_thread_id
    self.parent = pick_parent
    self.category = pick_category
    self
  end

  def register_author(client_ip)
    player = Player.find_or_create_by_ip(client_ip)
    self.author = player
  end

  private

  def pick_thread_id
    if parent_id && parent = Contribution.find_by_id(parent_id)
      return parent.thread_id
    end

    (Conversation.longest(3).sample ||
      Conversation.last ||
      Conversation.create).id
  end

  def pick_parent
    Contribution.find_by_id(parent_id) ||
      Contribution.where(thread_id: thread.id).last
  end

  def pick_category
    ( (!!parent && parent.category == CATEGORIES.first) ?
          CATEGORIES.last : CATEGORIES.first )
  end

  def branch_out_maybe
    self.thread = Conversation.new if beaten_to_the_punch?
  end

  def beaten_to_the_punch?
    return false if id || parent.nil?
    Contribution.where(
      parent_id: parent_id, thread_id: thread_id
    ).any?
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

  def signature_is_not_dangerous
    if signature != Sanitize.clean(signature)
      errors.add(:signature, "contrains restricted elements!")
    end
  end
end
