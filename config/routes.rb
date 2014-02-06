WebTelephone::Application.routes.draw do
  resources :contributions, except: [:index, :edit, :update, :destroy]
  get "/thank-you", to: "conversations#show", as: "thank_you"
  root to: "contributions#new"
end
