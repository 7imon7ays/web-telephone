require "spec_helper"

describe Contribution do
  before(:each) do
    @contribution = Contribution.new
  end

  it "validates the category" do
    @contribution.category = "foo"
    assert @contribution.save == false
  end
end

