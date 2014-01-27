class Contribution < ActiveRecord::Base
  CATEGORIES = ["picture", "sentence"]
  validates :category, inclusion: CATEGORIES
  validates :author, :thread, :s3_id, presence: true

  belongs_to :author, class_name: Player, foreign_key: :author_id
  belongs_to :thread, class_name: Conversation, foreign_key: :thread_id
  belongs_to :parent, class_name: Contribution, foreign_key: :parent_id
  has_many :children, class_name: Contribution, foreign_key: :parent_id

  def set_associations
    self.thread_id = pick_thread_id    
    self.parent = pick_parent
    self.category = pick_category
    self.s3_id = get_s3_id
  end
  
  def register_author(client_ip)
    player = Player.find_or_create_by_ip(client_ip)
    self.author = player
  end
  
  private
  
  def pick_thread_id
    # top_thread_ids defined in application_helper.rb
    Conversation.top_thread_ids.sample ||
    Conversation.last && Conversation.last.id ||
    Conversation.create!.id
  end
  
  def pick_parent
    Contribution.where(thread_id: thread_id).last
  end
  
  def pick_category
    ( (!!parent && parent.category == CATEGORIES.first) ?
          CATEGORIES.last : CATEGORIES.first )
  end

  def get_s3_id
    s3_id = "thread_#{thread_id}/#{category}_"
    parent ? s3_id.concat("#{parent.id + 1}") : s3_id.concat("1")
  end  
end
