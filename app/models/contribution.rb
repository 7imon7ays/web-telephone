class Contribution < ActiveRecord::Base
  validates :category, inclusion: ["picture", "sentence"]
end
