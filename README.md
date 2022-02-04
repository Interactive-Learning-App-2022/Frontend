# InterventiveLearning

To run this application, you must have the backend and the frontend running in seperate terminals.

### Running Backend
1. Install dependencies required - in directory where Pipfile is located, use `pipenv install` in the terminal.
2. Activate virtual enviorment with `pipenv shell`.
3. `cd` into `src/backend` and use `python manage.py runserver` in terminal.

### Running Frontend
1. Install Homebrew in the terminal(/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" ).
2. Install node via brew, type `brew install node` in the terminal.
3. Install yarn via `brew install yarn`.
4. `cd` into `src/frontend`.
5. Type `yarn install` to install all dependencies needed for deployment.
6. Type `yarn add node-sass` to install newest version of sass dependencies.
7. Type `yarn run build` to build production environment.
8. Type `yarn run dev` to run development environment.

`yarn run dev` will automatically open your default browser and run project on local machine.


Example logins
---
**Teacher**
john@example.com
Western1!

**Student**
student@example.com & student2@example.com
Western1!

