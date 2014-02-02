WebTelephone::Application.routes.draw do
  resources :contributions, except: [:edit, :update]
  get "/thank-you", to: "conversations#show", as: "thank_you"
  root to: "contributions#new"
end
