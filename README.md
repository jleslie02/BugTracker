

BugTracker
===========
Times are tough at ACME, Inc. They’ve had to cut back on their budget and as a result
no longer have any subscription to a bug tracking software. They’ve decided to
implement a rudimentary one for the time being and they’ve asked you to design,
implement, test, and deliver it.
Your bug tracker should have four categories:
Backlog
In Progress
Quality Assurance
Complete
Every category should be displayed within the same page (i.e. the page should be
divided into 4 sections).
Creating a new bug report should add a new list item to the Backlog category. Each bug
report should have an ID and a description summary that should be editable.
Issues should be draggable between categories.
Implement any extra features or functionality you deem necessary
### Install App

- Install: `bower install`
- Install: `npm install`

### Run App

- Run : `http-server`
* Then open a window and launch localhost<"port">
* <"port"> can be 8080 or whatever port is specified in the terminal after you executed the run task

### Functionalities

* Add a bug
* Delete a bug
* View bug description
* Edit a bug
* Move a bug from one status to another
* Undo a move

### Error Handling with meaningful notification

* Nothing to Undo
* Trying to insert a bug with an existing title
* Trying to insert a bug without title
* Trying to edit a bug without changing no property
* Trying to edit a bug by giving an empty title

### Can Be Added

* Insert a comment every time a move is made
* Add the date the bug has been created as a bug property
* Search bugs by dates
* Add bug priority
* Search bugs by priority
* Reorder bugs by Title
* Add the name of the bug instantiator
* Search bugs by the instantiator name

