class ContributionsController < ApplicationController
  def show
    render json: Contribution.find(params[:id])
  end

  def index
    if params[:top_id]
      @top_contribution = Contribution.find(params[:top_id])
      @prior_contributions = Contribution.includes(:author, :flags)
        .ancestors_of(@top_contribution)

      render json: @prior_contributions.to_json(include: [:author, :flags])
    end
  end

  def new
    if current_player.nil?
      register_new_visitor!
    else
      update_player_location!
    end

    @contribution = Contribution
      .new(parent_id: params[:parent_id])
      .set_associations(last_thread_id: session[:last_thread_id])
    @parent_blob = (@contribution.parent ? @contribution.parent.blob : nil)
  end

  def create
    @contribution = Contribution.new(contribution_params)

    if current_player.nil?
      @contribution.author = register_new_visitor!
    else
      @contribution.author = current_player
    end

    if @contribution.save
      @contribution.parent.emailers.each(&:deliver)

      session[:last_thread_id] = @contribution.thread_id
      render json: @contribution
    else
      render json: @contribution.errors.full_messages, status: 422
    end
  end

  def update
    @contribution = Contribution.find(params[:id])

    player_is_registered_and_authorized =
      current_player && @contribution.author_id == current_player.id

    if !player_is_registered_and_authorized
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
