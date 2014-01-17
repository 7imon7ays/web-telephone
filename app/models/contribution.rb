class Contribution < ActiveRecord::Base
  validates :category, inclusion: in: ["picture", "sentence"]
end
