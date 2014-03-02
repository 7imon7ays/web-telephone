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
    @contribution = Contribution.new(parent_id: params[:parent_id])
    @contribution.set_associations
    @parent_blob = (@contribution.parent ? @contribution.parent.blob : nil)
  end

  def create
    @contribution = Contribution.new(contribution_params)
    client_ip = request.remote_ip
    @contribution.register_author(client_ip)

    if @contribution.save
      session[:contributions] ||= Set.new
      session[:contributions].add @contribution.id
      render json: @contribution
    else
      render json: @contribution.errors.full_messages, status: 422
    end
  end

  def update
    @contribution = Contribution.find(params[:id])
    if !session[:contributions].include? @contribution.id
      render json: ["Not your submission!"], status: 401
    elsif @contribution.update_attributes(contribution_params)
      render json: @contribution
    else
      render json: @contribution.errors.full_messages, status: 422
    end
  end

  private

  def contribution_params
    params.require(:contribution).permit(
      :thread_id, :category, :blob,
      :parent_id, :empty_canvas_value, :signature
    )
  end
end
