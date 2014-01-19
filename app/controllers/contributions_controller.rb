class ContributionsController < ApplicationController
  def index
    @contributions = Contribution.all
    render json: @contributions
  end

  def new
    load "policy_document_hash.rb"
    @policy_document = PolicyDocument.new
    @contribution = Contribution.new(thread_id: pick_thread_id)
    @contribution.set_parent_id_and_category
  end

  def create
    @contribution = Contribution.new(contribution_params)
    client_ip = request.remote_ip
    @contribution.register(client_ip, params[:contribution])

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
