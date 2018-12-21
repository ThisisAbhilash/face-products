# face-products
Displays list of `ascii faces` with sizes in correct size. 
Implemented with `infinite scroll` and using web-worker to pre-emptively fetch data.

Key Features:-
#1. User can sort the results in ascending order as per price, size and id.
#2. The product list automatically loads more items as you scroll down.
#3. Loader is used to show animated sign while Loading data.
#4. To improve the user's experience, we fetch the next batch of results in advance using seperate thread or web-workers, making use of       idle-time.But they will not be displayed until the user has scrolled to the bottom of the product grid.
#5. when the user reaches the end and there are no more products to display, shows the message "~ end of catalogue ~".

### Ads features
#6. After every 20 products, an advertisement is shown.
#7. Ads are randomly generated, to ensure a user never see's the same ad twice in a row, used closure to hold the previously generated         random number, such that two consecutive random numbers are never same.

To run locally
#1. Clone the project and fire 'npm install' to download all dependencies.
#2. And then, 'npm start' to run project locally on 'http://localhost:3000'.
