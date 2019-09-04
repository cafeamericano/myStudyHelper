# **My Study Helper**

## Credits

©2019 Matthew Farmer

## Application Link

https://mystudyhelper.herokuapp.com/

## About
My Study Helper is an application designed to allow programming students to keep track of their study habits. After creating an account, users may create/read/update/delete study session entries as well as view informative graphs and statistics relating to their study habits.

## Walkthrough

Login screen. Users have the ability to create a new account from here as well.
![login](/screenshots/login.png)

Home screen, displaying cards reflecting previous entries. Each card indicates the date of the study session, the number of hours spent studying, the programming language studying, and any entered comments. On the right-hand side of the page, users may (a) log out, (b) add a new entry, or (c) view statistics regarding their study habits.
![home](/screenshots/home.png)

Add entry modal. This is activated by clicking the '+' icon on the right-hand side of the home page.
![addEntry](/screenshots/addEntry.png)

Edit entry modal. This is activated by clicking the 'edit' icon at the top of the card for the entry being edited. Users will be presented with the information as it currently is and may overwrite information as needed.
![editEntry](/screenshots/editEntry.png)

Statistics modal with a view of hours studied over time. This is activated by clicking the 'graph' icon on the right-hand side of the home page and the 'Hours By Time' tab inside of the modal that appears. Users may hover over any data point in the graph to see how many hours were spent studying on that particular day.
![hoursByTime](/screenshots/hoursByTime.png)

Statistics modal with a view of hours studied by programming language. This is activated by clicking the 'graph' icon on the right-hand side of the home page and the 'Hours By Language' tab inside of the modal that appears. Users may hover over any section of the chart to see how many hours have been spent studying that specific programming language.
![hoursByLanguage](/screenshots/hoursByLanguage.png)

Statistics modal with an indication of the total number of hours spent studying.
![hoursByTotal](/screenshots/hoursByTotal.png)

## Technologies Used

This application is built on NodeJS and hosted via Heroku. It uses PostgreSQL for its database and Express for routing. HandlebarsJS serves as the templating engine while Firebase provides user authentication. jQuery and AJAX calls are heavily used throughout the application, and graphs are provided by utilizing the ChartsJS API.
