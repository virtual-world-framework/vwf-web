require 'sinatra/base'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :public_folder, File.dirname(__FILE__)

  get '/' do
    File.read('index.html')
  end
end
