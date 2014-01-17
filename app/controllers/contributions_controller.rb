class ContributionsController < ApplicationController
  def index
    @contributions = Contribution.all
    render json: @contributions
  end

  def new
    @contribution = Contribution.new
  end

  def create
    @contribution = Contribution.new(contribution_params)

    if @contribution.save
      redirect_to contributions_url
    else
      flash[:errors] = @contribution.errors.full_messages
      render :new, status: 422
    end
  end

  private

  def contribution_params
    params.require(:contribution).permit(:category)
  end

end
