# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


Introduction

This React application is a prototype POS System (Point of Sale System) designed to demonstrate core functionalities such as managing departments, employees, products, customers, orders, and sales. The app uses a modern React framework with a dynamic and user-friendly interface, enabling seamless interaction with various system components.

The project emphasizes modular design, database integration, and extensibility for future features and enhancements.

Features

Department Management:
Create new departments, which serve as prerequisites for employee management.
Ensures data consistency by requiring employees to be associated with a valid department.
Employee Management:
Add employees with details such as first name, last name, and date of birth.
Delete employees, with changes reflected in real-time in both the UI and the MySQL database.
Reports:
Monitor employees by adding and deleting short notes (limited to 100 characters) about individual performance or other details.
Products:
Manage product inventory by adding, updating, or deleting products.
Changes update both the live preview table and the MySQL database.
Customers:
Add and manage customer details, including first name, last name, email, and phone number.
Integrates directly with the order system, ensuring that all orders are linked to a valid customer.
Orders:
Create and delete orders with real-time updates.
Orders connect customers to products and are reflected across related pages like sales and receipts.
Sales:
A simulated "shopping cart" feature displays order details and totals.
Select employees and customers associated with orders.
Submit orders, updating the receipts page and MySQL database with the completed transaction.
Receipts:
View finalized orders, including detailed information and total costs.
Delete receipts, which removes all associated data from the database.

Technology Stack

Frontend
React: Used for building the user interface and managing app state.
React Router: Provides navigation and routing for the application.
CSS: For styling components to ensure a responsive and user-friendly design.
Backend
Node.js & Express: Handles API requests and serves data to the frontend.
MySQL: Used for storing and managing all application data, ensuring persistence and integrity.

Key Considerations

Prototype Nature: This app is a foundational prototype with scope for scalability and security enhancements, such as authentication, detailed reporting, and administrative features.

Future Plans:
Include additional fields like phone, email, and social security for employees.
Enhance the reporting module for more robust analytics.
Improve the overall user experience with advanced styling and interaction.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
