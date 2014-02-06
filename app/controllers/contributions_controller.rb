class ContributionsController < ApplicationController
  def show
    render json: Contribution.find(params[:id])
  end

  def new
    @contribution = Contribution.new
    @contribution.set_associations
    @parent_blob = (@contribution.parent ? @contribution.parent.blob : nil)
  end

  def create
    @contribution = Contribution.new(contribution_params)
    client_ip = request.remote_ip
    @contribution.register_author(client_ip)

    if @contribution.save
      redirect_to thank_you_url(thread_id: @contribution.thread_id)
    else
      flash[:errors] = @contribution.errors.full_messages
      render json: @contribution, status: 422
    end
  end

  private

  def contribution_params
    params.require(:contribution).permit(:thread_id, :category, :blob, :parent_id)
  end
end
