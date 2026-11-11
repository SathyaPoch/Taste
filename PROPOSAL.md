# Taste

Taste is a web-based system that helps farmers sell products to potential buyers , and allows pre-order platforms that connect farmers with restaurants , retailers , and food manufacturers . Instead of relying on the middle man or personal contact , local markets could cause sudden price fall during harvest peaks and some crops go to waste.

## Problem

Farmers grow crops successfully but cannot sell their product and lost money due to the lack of coordinate between farmers and buyers , proper storage and transportation.

Buyers having a hard time finding afforadable argricultural products with a stable price. Especially in the city which have a high demands for argricultural products. While some farmers may grow a large quantity of crops without knowing who will buy them, Which cause the price market to collapse.

## Users and roles

- Admin : what they do in the app
- Farmer : listing crops with prices,locations , quantities and recevie offer or reject offers and track sale dashboard
- Buyer : look for avaialable crops , request to buy , negotiate with the farmer or confirm offer and track order , request to buy in group with a specific location

## User stories

1. As a farmer, I want to list my crops with the price, quantity, location and expected harvest date so that buyers can find my products before the harvest peak and I do not have to sell at a collapsed price.
   Accepted when:
   - The farmer can create a listing that includes the crop name, quantity, unit price, location and available date.
   - The listing becomes visible to buyers right after the farmer save it.
   - The farmer can edit or close the listing at any time, and the remaining quantity updates automatically when an order is confirmed.
2. As a buyer, I want to search and filter available crops by type, location, price and date so that the farmer can quickly find affordable products with a stable price.
   Accepted when:
   - I can filter the results by crop type, location, and available date.
   - Each result shows the price, the remaining quantity, the farmer's name and the location.
   - Listings that are closed or sold out do not appear in the results.
3. As a buyer, I want to send a request to buy with my preferred quantity, price and delivery date so that can secure my supply before the harvest.
   Accepted when:
   - The system does not let me request more than the quantity that is still available.
   - The farmer receives a notification as soon as I send the request.
   - I can see the status of my request (Pending, Accepted, Rejected, Countered or Expired) at any time.
4. As a farmer, I want to accept or reject the offers I receive so that I only sell at prices I am happy with.
   Accepted when:
   - The farmer can see all pending offers for each listing, with the buyer, quantity and offered price.
   - Accepting an offer notifies the buyer and moves the deal to the confirmation step.
   - Rejecting an offer notifies the buyer, and I can add an optional reason.

5. As a farmer or a buyer, I want to send a counter-offer on the price or quantity so that we can reach a fair agreement without going through a middleman.
   Accepted when:
   - Either side can send a counter-offer, and the latest offer is clearly shown.
   - The full negotiation history is visible to both sides.
   - An offer expires automatically after a set time (for example, 48 hours) if nobody responds.

6. As a buyer, I want to confirm an offer that the farmer has accepted so that the deal becomes a binding order for both sides.
   Accepted when:
   - A deal becomes an order only after both sides have agreed.
   - Confirming the order reduces the listing's remaining quantity.
   - Both the farmer and the buyer receive an order summary with the crop, quantity, price and delivery date.

7. As a buyer, I want to track the status of my orders from confirmation to delivery so that I know exactly when my products will arrive and can plan my business.
   Accepted when:
   - Order statuses are Confirmed, Preparing, Ready or Shipped, and Delivered.
   - The farmer can update the status, and I can see the history with dates.
   - I can view all my current and past orders in one list.

8. As a farmer, I want to see a sales dashboard with my revenue, orders and top-selling crops so that I can decide what and how much to grow in the next season.
   Accepted when:
   - The dashboard shows total revenue, the number of orders by status and the top-selling crops.
   - I can filter the data by date range.
   - Pending offers are shown so I can respond quickly.

9. As a buyer, I want to start or join a group purchase request for a specific location so that several buyers can order in bulk together and get a lower price and shared delivery.
   Accepted when:
   - A group request has a crop, target quantity, delivery location and deadline.
   - Other buyers in the same area can join and add their own quantity.
   - Farmers can see the total group demand and offer one price for the whole group.

10. As an admin, I want to verify user accounts and remove suspicious listings so that farmers and buyers can trust the platform.
    Accepted when:
    - I can remove any listing that breaks the rules after 10+ farmer/buyer report any suspicious account.
    - unbanned or approved account that appeal and prove to be legit

## MVP scope

Must have:

- Story 1 : Farmer lists crops
- Story 2 : Buyer could searches for crops
- Story 3 : Buyer sends a pre-order request to buy from farmer
- Story 4 : Farmer accepts or rejects offers
- Story 5 : Counter offer (price& quantity)
- Story 6 : Buyer confirmed/accept offer
- Story 7 : Buyer track orders (Confirmed , Preparing , Ready , Shipped)
- Story 10 : admin dashboard/panel

Nice to have:

- Story 8 : Farmer sales graph and dashboard
- Story 9 : Group purchase by location

## Entities

| Entity | Main attributes                     | Relations                      |
| ------ | ----------------------------------- | ------------------------------ |
| Farmer | name, phone number, role , password | has many listings              |
| Buyer  | name , email/phone number, password | has many orders lists          |
| Admin  | name , email, password              | manage many buyers and farmers |

## Stretch feature

One of: search & filter(pagination)
What it does in this app:
**Search + filter(pagination)**

- Allow buyers to search listings by crop name and filter by crop type, location, price range and available date .
- Results show the price, remaining quantity, farmer's name and location, sorted by newest or lowest price.
- Results load 10 per page .

## Technology stack

| Syntax     | Description                           |
| ---------- | ------------------------------------- |
| Language   | TypeScript                            |
| Frontend   | Vue 3,Vite, Vue Router, Pinia         |
| Backend    | NestJS(REST API)                      |
| Daatabase  | PostgreSQL with Prisma ORM            |
| Quality    | Jest                                  |
| Deployment | Docker, docker compose,GitHub Actions |
