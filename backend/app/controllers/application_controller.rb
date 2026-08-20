class ApplicationController < ActionController::API
  around_action :set_time_zone

  private

  def set_time_zone(&action)
    time_zone = request.headers['X-Timezone'] || 'UTC'
    Time.use_zone(time_zone, &action)
  end
end
