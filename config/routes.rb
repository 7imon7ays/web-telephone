WebTelephone::Application.routes.draw do
  resources :contributions, except: [:edit, :update]
  root to: "contributions#new"
end
