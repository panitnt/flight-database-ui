# database-ui

## Instruction for use this UI
### Insert view in your database
Create and Insert data from [this file](https://github.com/panitnt/database-data/blob/main/01-createandinsert.ipynb)
### Insert view in your database
Create view from [this file](https://github.com/panitnt/database-data/blob/main/04-addviews.ipynb)
### Clone UI

* Clone this project
```
git clone https://github.com/panitnt/database-ui.git
```

* Get into project folder
```
cd database-ui
```

* Install module
```
npm i
```

* Create ```.env``` file (also see sample in sample.env)
```
PORT=8083
DB_SERVER=localhost
DB_USER=sa
DB_PWD=(Your database password)
DB_NAME=Flight
DB_PORT=1433
```

* Run in local
```
node index.js
```

