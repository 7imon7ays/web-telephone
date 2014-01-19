class Contribution < ActiveRecord::Base
  CATEGORIES = ["picture", "sentence"]
  validates :category, inclusion: CATEGORIES
  validates :author, :thread, presence: true

  belongs_to :author, class_name: Player, foreign_key: :author_id
  belongs_to :thread, class_name: Conversation, foreign_key: :thread_id
  belongs_to :parent, class_name: Contribution, foreign_key: :parent_id
  has_many :children, class_name: Contribution, foreign_key: :parent_id

  def register(client_ip, contribution_params)
    player = Player.find_or_create_by_ip(client_ip)
    self.author = player

    if contribution_params[:start_new_thread]
      self.thread = Conversation.new
    else
      self.thread = Conversation.find(1) # TODO: set thread to the parent's thread
    end
  end

  def set_parent_id_and_category
    parent = ( thread_id ? Contribution.where(thread_id: thread_id).last : false )
    category = ( parent && parent.category == CATEGORIES.first ?
      CATEGORIES.second : CATEGORIES.first )
  end
  
end
