WebTelephone::Application.routes.draw do
  resources :contributions, except: [:edit, :update, :destroy]
  get "/thank-you", to: "conversations#thank_you", as: "thank_you"
  root to: "contributions#new"
end
