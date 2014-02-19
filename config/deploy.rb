set :application,       'vwf-web'
set :deploy_to,         "/var/www/#{application}"
set :repository,        '_site'
set :scm,               :none
set :deploy_via,        :copy
set :copy_compression,  :gzip
set :use_sudo,          false
set :host,              '192.241.250.175'
 
role :web,  host
 
set :user,    'vwf'
set :group,   user
 
before 'deploy:update', 'deploy:update_jekyll'
 
namespace :deploy do
 
  [:start, :stop, :restart, :finalize_update].each do |t|
    desc "#{t} task is a no-op with jekyll"
    task t, :roles => :app do ; end
  end
  
  desc 'Run jekyll to update site before uploading'
  task :update_jekyll do
    %x(rm -rf _site/* && jekyll build)
  end
  
end
