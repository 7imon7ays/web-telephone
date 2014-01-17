class ContributionsController < ActionController::Base

  def index
    @contributions = Contribution.all
    render json: @contributions
  end

  def new
    @contribution = Contribution.new
  end

  def create
    @contribution = Contribution.new(params[:contribution])

    if @contribution.save
      redirect_to contribution_url(@contribution)
    else
      flash[:errors] = @contribution.errors.full_messages
      render :new, status: 422
    end
  end

end
