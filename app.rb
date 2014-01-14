require 'sinatra/base'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    File.read(File.join('public', 'index.html'))
  end
end
