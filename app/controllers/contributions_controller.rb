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
    Thread.new do
      abstract_adapter = ActiveRecord::Base.connection_pool.checkout
      if current_player.nil?
        new_token = SecureRandom::base64(32)
        cookies.permanent[:token] = new_token
        Player.create!(cookie: new_token, ip_address: request.remote_ip)
      else
          request.remote_ip == current_player.ip_address ?
          current_player : current_player.save!(ip_address: request.remote_ip)
      end
      ActiveRecord::Base.connection_pool.checkin(abstract_adapter)
    end

    @contribution = Contribution
      .new(parent_id: params[:parent_id])
      .set_associations(last_thread_id: session[:last_thread_id])
    @parent_blob = (@contribution.parent ? @contribution.parent.blob : nil)
  end

  def create
    @contribution = Contribution.new(contribution_params)

    if cookies.permanent[:token].nil?
      new_token = SecureRandom::base64(32)
      cookies.permanent[:token] = new_token
      @contribution.author = Player.create!(cookie: new_token, ip_address: client_ip)
    else
      @contribution.author = current_player
    end

    if @contribution.save
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
