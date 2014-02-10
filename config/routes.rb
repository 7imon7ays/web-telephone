WebTelephone::Application.routes.draw do
  resources :contributions, except: [:index, :edit, :update, :destroy]
  resources :conversations, only: :show
  get "/thank-you", to: "conversations#thank_you", as: "thank_you"
  root to: "contributions#new"
end
