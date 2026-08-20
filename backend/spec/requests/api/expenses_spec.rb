require 'rails_helper'

RSpec.describe "Api::Expenses", type: :request do
  let!(:food_category) { Category.create!(name: "Food") }
  let!(:transport_category) { Category.create!(name: "Transport") }

  describe "GET /api/expenses" do
  let!(:expense1) { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.new(2026, 8, 18)) }
  let!(:expense2) { Expense.create!(description: "Taxi", amount: 50.00, category: transport_category, date: Date.new(2026, 8, 19)) }
  let!(:expense3) { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.new(2026, 8, 17), created_at: Time.zone.parse("2026-08-17 10:00:00")) }
  let!(:expense4) { Expense.create!(description: "Taxi", amount: 50.00, category: transport_category, date: Date.new(2026, 8, 17), created_at: Time.zone.parse("2026-08-17 15:00:00")) }

    it "returns all expenses with category information" do
      get "/api/expenses"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(4)
    end

    it "returns expenses in descending order by date" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json[0]["id"]).to eq(expense2.id)
      expect(json[1]["id"]).to eq(expense1.id)
    end

    it "returns expenses in descending order by created_at when they have the same date" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json[2]["id"]).to eq(expense4.id)
      expect(json[3]["id"]).to eq(expense3.id)
    end
  end

  describe "POST /api/expenses" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          expense: {
            description: "Team Lunch",
            amount: 150.50,
            category_id: food_category.id,
            date: Date.today
          }
        }
      end

      it "creates a new expense" do
        expect {
          post "/api/expenses", params: valid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["description"]).to eq("Team Lunch")
        expect(json["amount"]).to eq(150.5)
      end
    end

    context "with invalid parameters" do
      it "with negative amounts" do
        invalid_params = {
          expense: {
            description: "Invalid expense",
            amount: -100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "with empty descriptions" do
        invalid_params = {
          expense: {
            description: "",
            amount: 100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end
  end
end
