# DrUnk404

## Description

**DrUnk404** is the backend part of a full-stack project created by a group of full-stack developers as their final course project. This API provides endpoints for managing a cocktail catalog, including user authentication, user details, filters, and cocktail information. Please check our [Documentation](https://drunk404.onrender.com/api-docs/)

## Usage

To get started with using the API, you can use the hosted version of the project by following the `https://drunk404.onrender.com/ + chosen endpoint`. First, the user needs to be authorized, as all other functionality is protected.

### Local Usage

Alternatively, instead of using the hosted version of the product, the API can be run locally. To run this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Update the `.env` file with the necessary variables as described in `env.example`.
3. Install the necessary dependencies using the following command:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your Postman application and go to `http://localhost:3000 + chosen endpoint`.

## Endpoints

### `/auth`

- `POST /signup`: Receives the body with required fields: `username`, `birthDate`, `email`, `password`.
- `POST /signin`: Receives the body with required fields: `email`, `password`.
- `POST /signout`

### `/users`

- `GET /current`: Returns the current user object with all fields except password.
- `PATCH /update`: Receives the body with optional fields: `avatarURL`, `username`. Returns user object with all fields except password.
- `POST /subscribe`: Receives the body with the required field `email`. Returns a successful or error message.

### `/filters`

- `GET /categories`: Returns all cocktail categories.
- `GET /ingredients`: Returns all ingredients for cocktail creation.
- `GET /glasses`: Returns all glasses for cocktail creation.

### `/drinks`

- `GET /mainpage`: Returns an object with keys - `categories` and values - an array of 3 cocktails from the category.
- `GET /popular`: Returns cocktails sorted by the field ‘favorite’ from the most popular to the least.
- `GET /search`: Returns cocktails that might be filtered by category, ingredient, search query, and pagination, and cocktails limit per page.
- `GET /:id`: Receives the body with the required field `id`. Returns the cocktail by id.

- `POST /own/add`: Receives form-data with required fields: drink, category, alcoholic, glass, ingredients, and optional fields: description, instructions, drinkThumb, shortDescription. Creates the cocktail in the DB. Returns the newly created cocktail.

- `DELETE /own/remove`: Receives the body with the required field id and deletes the cocktail. Returns a successful message.

- `GET /own`: Returns all cocktails created by the user.

- `POST /favorite/add`: Receives the body with the required field id and adds to ‘favorite’ user id. Returns the favorite cocktail.

- `DELETE /favorite/remove`: Receives the body with the required field id and deletes the user id from the ‘favorite’ field. Returns the deleted cocktail.

- `GET /favorite`: Returns all user favorite cocktails.


## Technologies Used

- Node.js
- JavaScript 
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer
- Joi
- Multer
- Gravatar
- Swagger



