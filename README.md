# Rad5-assessment

## Project Title

A Task Management Application.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js
- Yarn
- MongoDB

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**

    ```sh
    yarn
    ```

3. **Create a `.env` file:**

    Create a `.env` file in the root of the project and add the following variables:

    ```
    PORT=yourport
    JWT_SECRET=yourSecret
    ```
    check .env.example file 

4. **Start the server:**

    ```sh
    yarn dev
    ```

### Running Tests

To run tests, use the following command:

```sh
yarn test

note to stop the server before running test

