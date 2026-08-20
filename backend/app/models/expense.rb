class Expense < ApplicationRecord
  belongs_to :category


  validate :invalidate_future_dates

  private

  def invalidate_future_dates
    if date > Date.current
      errors.add(:date, "Cannot create expenses in the future")
    end
  end
end
