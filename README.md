# BookStore
## Business Domain
The real-world business domain I choose for this project is a book store application. The application will provide a platform for users to browse, purchase, and rent books from the store. The application will also keep track of the store's inventory, book categories, authors, and borrowers

## Business Activities
The book store application will provide the following activities to its users
- Browse books by category, author, or search by book name
- Purchase books
- Rent books
- Keep track of the store's inventory
- Keep track of book categories and authors
- Keep track of borrowers 

## Business Process
The following business process will be implemented in the book store application
- Customers can browse books by category, author, or search by book name
- Customers can purchase books by selecting the desired book and proceeding to checkout
- Customers can rent books by selecting the desired book and specifying the rental period
-The application will update the inventory after each purchase or rental
-The application will keep track of book categories and authors and update them accordingly
-The application will keep track of borrowers and their borrowed books 

## Business Requirements
The following business requirements necessitate the collection, management, and use of data
- Keep track of inventory and book categories
- Keep track of authors and their books
- Keep track of rented and sold books
- Keep track of borrowers and their borrowed books 

## Database Design
The database design will consist of the following tables
- Books: Contains Book ID, book names, book price, the amount in store
- Book Categories: Contains Book categories, book ID, amount of books in each category
- Authors: Contains Author ID, names, email
- Rented books: Contains Rented book ID, name, rented date, date to return
- Sold books: Contains Sold Book ID, names, date sold, prices
- Borrowers: Contains Person ID, names, Book ID 

## Normalization:
Normalization is the process of organizing data in a database so that it is consistent and can be easily queried. In this project, we will use the third normal form (3NF) to normalize the data. The tables will be organized as follows
- Books (Book ID, book name, price)
- Categories (Category ID, category name)
- BookCategories (Book ID, Category ID, amount)
- Authors (Author ID, name, email)
- RentedBooks (Rent ID, Book ID, Person ID, rented date, return date)
- SoldBooks (Sale ID, Book ID, person ID, sale date, price)
- Borrowers (Person ID, name) 

## Implementation
We will use Microsoft SQL Server to implement the book store application. The SQL Server Management Studio will be used to create the database and the tables. The tables will be populated with data using SQL queries. The application will be developed using a programming language which is javascript using express as backend server.