WebTelephone::Application.routes.draw do
  resources :contributions, except: [:destroy, :edit] do
    resources :flags, only: [:create, :destroy]
  end
  get "/thank-you", to: "conversations#index", as: "thank_you"
  root to: "contributions#new"
end
