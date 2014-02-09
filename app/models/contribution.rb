class Contribution < ActiveRecord::Base
  attr_accessor :empty_canvas_value
  CATEGORIES = ["picture", "sentence"]
  validates :category, inclusion: CATEGORIES
  validates :author, :thread, :blob, presence: true
  validates_uniqueness_of :parent_id, scope: :thread_id
  validate :contribution_is_not_default

  belongs_to :author, class_name: Player, foreign_key: :author_id
  belongs_to :thread, class_name: Conversation, foreign_key: :thread_id
  belongs_to :parent, class_name: Contribution, foreign_key: :parent_id
  has_many :children, class_name: Contribution, foreign_key: :parent_id

  before_validation :branch_out_maybe

  def set_associations
    self.thread = pick_thread
    self.parent = pick_parent
    self.category = pick_category
  end

  def register_author(client_ip)
    player = Player.find_or_create_by_ip(client_ip)
    self.author = player
  end

  private

  def pick_thread
    Conversation.longest(5).sample ||
      Conversation.last ||
      Conversation.create
  end

  def pick_parent
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
    return false unless parent
    Contribution.where("parent_id = ? AND id != ?", parent.id, id).any?
  end

  private

  def contribution_is_not_default
    if blob == "" || blob == empty_canvas_value
      errors.add(:blob, "can't be the default!")
    end
  end
end
