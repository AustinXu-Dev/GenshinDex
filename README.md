# GenshinDex

GenshinDex is a Full-Stack CRUD web application built using **Next.js** and **Tailwind CSS**, designed to provide an easy-to-use database for Genshin Impact players. This app allows users to manage data about the game's characters, weapons, and monsters. The application integrates with MongoDB Atlas to store and manipulate data using RESTful API endpoints.

**Website**: [GenshinDex Live](https://genshin-dex.vercel.app)  
**Repository**: [GitHub Repo](https://github.com/AustinXu-Dev/GenshinDex)

## Team members
**Pyape Phyo Aung** : [Link to repo](https://github.com/AustinXu-Dev/AustinXu-Dev.github.io)
**Phyu THandar Khin** : [Link to repo](https://github.com/ElenaKhin/ElenaKhin.github.io)
**Khaing Thin Zar Sein** : [Link to repo](https://github.com/jue-iroiro/jue-iroiro.github.io)

## Features

- **CRUD Operations**: Users can create, read, update, and delete game-related data for the following entities:
  - **Characters**
  - **Weapons**
  - **Monsters**
  
- **Sorting & Filtering**: Users can sort and filter each entity (characters, weapons, and monsters) based on different criteria such as name, type, element, or rarity.

- **REST API**: The application uses a RESTful API to handle CRUD operations on the data, providing seamless data management.

- **MongoDB Atlas**: The data is stored in MongoDB Atlas, a fully-managed cloud database service, ensuring security and scalability.

## Tech Stack

### Frontend
- **Next.js**: A React-based framework that enables server-side rendering and building static websites.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

### Backend
- **MongoDB Atlas**: A cloud-based NoSQL database solution for storing game data.
- **REST API**: Used for performing CRUD operations on characters, weapons, and monsters.

### Other Tools
- **Vercel**: Deployed on Vercel for easy access and high performance.
- **Axios/Fetch API**: For handling HTTP requests to the backend.

## Installation and Setup

Follow the steps below to set up the project locally:

### Prerequisites
- **Node.js** (version 14.x or higher)
- **MongoDB Atlas** account (you will need to create a MongoDB cluster and connect it to the app)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/AustinXu-Dev/GenshinDex.git
   ```

2. Navigate into the project directory:
   ```bash
   cd GenshinDex
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your MongoDB connection string and any other necessary environment variables:
   ```bash
   MONGODB_URI=your_mongo_atlas_connection_string
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## API Endpoints

The application exposes several REST API endpoints for interacting with the data entities. Here's a brief overview:

- **GET /api/characters**: Get a list of all characters.
- **POST /api/characters**: Add a new character.
- **PUT /api/characters/:id**: Update an existing character by ID.
- **DELETE /api/characters/:id**: Delete a character by ID.

Similar endpoints exist for **weapons** and **monsters**.

## Features in Detail

### Characters
- **View**: Browse through the entire character database.
- **Add**: Add new characters with details such as name, element, weapon type, and more.
- **Edit**: Update character information.
- **Delete**: Remove characters from the database.

### Weapons
- **View**: List of all weapons with their properties.
- **Add**: Create new weapon entries.
- **Edit**: Update existing weapon details.
- **Delete**: Remove a weapon from the database.

### Monsters
- **View**: Explore the monster list with stats and other information.
- **Add**: Add new monsters.
- **Edit**: Modify monster information.
- **Delete**: Remove a monster from the database.

### Sorting and Filtering
Each entity can be sorted and filtered based on criteria specific to the entity. You can look at the examples in the screenshots provided below.

![11](https://github.com/user-attachments/assets/8e2c920d-440a-4e2d-b124-956754ccf8e2)
![12](https://github.com/user-attachments/assets/1a5e5db4-5eb9-4c2e-b0cc-82ed213edfdf)
![13](https://github.com/user-attachments/assets/6a3f3b60-f1ad-4d25-b68a-8f2601997b7b)
![14](https://github.com/user-attachments/assets/97390abf-ca11-45a2-8c06-8d4b04dc2f96)
![15](https://github.com/user-attachments/assets/6a297d11-fa83-4cc2-bf7e-c67e0ee4f927)
![16](https://github.com/user-attachments/assets/486c74e8-314a-4608-8706-a323e1e7d8ed)
![17](https://github.com/user-attachments/assets/96e49c91-265c-4954-b8df-2fb098228296)
![18](https://github.com/user-attachments/assets/ce50f327-8d77-4b56-849c-43b02fadf1a4)
