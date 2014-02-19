class ContributionsController < ApplicationController
  def show
    render json: Contribution.find(params[:id])
  end

  def index
    if params[:top_id]
      @top_contribution = Contribution.find(params[:top_id])
      @prior_contributions = Contribution.ancestors_of(@top_contribution)

      render json: @prior_contributions.to_json(include: :author)
    else
      render json: Contribution.all
    end
  end

  def new
    @contribution = Contribution.new({ parent_id: params[:parent_id] })
    @parent_blob = (@contribution.parent ? @contribution.parent.blob : nil)
  end

  def create
    @contribution = Contribution.new(contribution_params)
    client_ip = request.remote_ip
    @contribution.register_author(client_ip)

    if @contribution.save
      render json: @contribution
    else
      render json: @contribution.errors.full_messages, status: 422
    end
  end

  private

  def contribution_params
    params.require(:contribution).permit(
    :thread_id, :category, :blob, :parent_id, :empty_canvas_value
    )
  end
end
