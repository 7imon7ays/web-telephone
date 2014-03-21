WebTelephone::Application.routes.draw do
  resources :contributions, except: [:destroy, :edit] do
    resources :emailers, only: [:create]
    resources :flags, only: [:create, :destroy]
  end
  get "emailers/:emailer_id/delete" => "emailers#destroy", as: :delete_emailer
  get "/thank-you", to: "conversations#index", as: "thank_you"
  root to: "contributions#new"
end

