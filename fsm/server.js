const express = require('express');
const cors = require('cors');
const { interpret, assign } = require('xstate');
const log = require('./log.js');  // Import the logger from log.js
const app = express();
const machine = require('./stateMachine.js'); // FSM logic
const bodyParser = require('body-parser');

// Initialize the logger with 'server.js' as the file label
const logger = log('server.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 3000;
const keys = {};
let httpReq = {};

// Sample Route (Health Check)
app.post('/login', (req, res) => {
  logger.info('Express server is running 🚀'); // Log server status
  res.send('Express server is running 🚀');
});

// POST /users - Create a new user (sign up)
app.post('/users', (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const newUser = { id: Date.now(), email, firstName, lastName, password };

  // Sending to JSON Server (frontend db.json)
  axios.post('http://localhost:3000/users', newUser)
    .then(response => {
      res.status(201).json(response.data);  // Return created user data
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to create user', message: err.message });
    });
});

// GET /users - Fetch user by email for login
app.get('/users', (req, res) => {
  const { email } = req.query;
  axios.get(`http://localhost:3000/users?email=${email}`)
    .then(response => {
      if (response.data.length > 0) {
        res.json(response.data);  // User found
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Error fetching user', message: err.message });
    });
});


// FSM Route
app.post('/fsm/machine', (req, res) => {
  logger.info('Incoming request body:', req.body); // Log the incoming request body
  httpReq = req.body;
  const key = httpReq.key;

  if (!httpReq.data || !httpReq.transition) {
    return res.status(400).json({ error: 'Missing data or transition in request' });
  }

  if (key) {
    if (key in keys) {
      const { service } = keys[key];
      const jsonObj = httpReq.data;

      logger.info(`Data from Front-End = ${JSON.stringify(jsonObj)}`);
      logger.info(`Front-End transition = ${httpReq.transition}`);

      if (service.state.nextEvents.includes(httpReq.transition)) {
        service.send({ ...jsonObj, type: httpReq.transition });
      } else {
        return res.json({
          code: 'FSM-01',
          errorMessage: 'Invalid request. Press Ok to restart the use case',
          ...service.state.context,
        });
      }

      logger.info(`State: ${service.state.value}`);
    } else {
      logger.info('Key does not exist');

      keys[key] = {
        service: null,
        res: res,
        sendingFunction: (ctx, myKey) => {
          const resp = keys[myKey].res;
          if (!resp.headersSent) {
            resp.json(ctx);
          }
        },
      };

      const newMachine = machine.withConfig({
        actions: {
          sendCtx: (context, _event) => {
            keys[key].sendingFunction(context, key);
          },

          // Login/Signup Actions
          loginAccount: assign((context, event) => {
            context.user = event.user;
            return context;
          }),
          signupAccount: assign((context, event) => {
            context.user = event.user;
            return context;
          }),
          loginSuccess: assign((context, event) => {
            context.user = event.user;
            return context;
          }),
          logError: assign((context, event) => {
            logger.error("Error:", event.error);  // Log error with winston
            context.error = event.error;
            return context;
          }),

          // Navigation Actions
          goToMealsList: (_context, _event) => {
            logger.info("Navigating to Meals List");
          },
          goToGrocery: (_context, _event) => {
            logger.info("Navigating to Grocery List");
          },
          goToRecipes: (_context, _event) => {
            logger.info("Navigating to Recipes");
          },
          goToFavorites: (_context, _event) => {
            logger.info("Navigating to Favorites");
          },
          logoutAccount: (_context, _event) => {
            logger.info("Logging out...");
          },
          goToHome: (_context, _event) => {
            logger.info("Navigating to Home");
          },

          // Meal Actions
          deleteMeal: (context, event) => {
            logger.info("Deleting meal", event.mealId);
          },
          addMeal: (context, event) => {
            logger.info("Adding meal", event.meal);
          },

          // Grocery Actions
          showCreateListInput: assign({
            showCreateListInput: true,
          }),
          hideCreateListInput: assign({
            showCreateListInput: false,
            newListName: "",
          }),
          showAddItemInput: assign({
            showAddItemInput: true,
          }),
          hideAddItemInput: assign({
            showAddItemInput: false,
            newItemName: "",
          }),

          // Recipe Actions
          searchRecipe: (context, event) => {
            logger.info("Searching for recipe:", event.query);
          },
          selectCategory: (context, event) => {
            logger.info("Selecting category:", event.category);
          },
          getRandomRecipe: (_context, _event) => {
            logger.info("Getting a random recipe...");
          },
          viewRecipeDetails: (context, event) => {
            logger.info("Viewing recipe details for:", event.recipeId);
          },
          markRecipeAsFavorite: (context, event) => {
            logger.info("Marking recipe as favorite:", event.recipeId);
          },
          unmarkRecipeAsFavorite: (context, event) => {
            logger.info("Unmarking recipe from favorites:", event.recipeId);
          },
          retryRecipeSearch: (_context, _event) => {
            logger.info("Retrying recipe search");
          },

          // Video/Meal Plan Actions
          watchRecipeVideo: (context, event) => {
            logger.info("Watching recipe video:", event.videoId);
          },
          addRecipeToMealPlan: (context, event) => {
            logger.info("Adding recipe to meal plan:", event.recipeId);
          },
          addIngredientsToGroceryList: (context, event) => {
            logger.info("Adding ingredients to grocery list:", event.ingredients);
          },

          // Logout UI Action
          cancelLogout: (_context, _event) => {
            logger.info("Canceling logout");
          },

          // UI-specific Actions
          focusOnInput: assign({
            showCreateListInput: true,
          }),
          focusOnItemInput: assign({
            showAddItemInput: true,
          }),
        },
      });

      const service = interpret(newMachine);
      service.start();
      keys[key].service = service;

      service.onTransition((state) => {
        logger.info(`NextEvents: = ${state.nextEvents}`);
      });

      const jsonObj = httpReq.data;
      logger.info(`Data from Front-End = ${JSON.stringify(jsonObj)}`);

      if (service.state.nextEvents.includes(httpReq.transition)) {
        service.send({ ...jsonObj, type: httpReq.transition });
      } else {
        return res.json({
          code: 'FSM-01',
          errorMessage: 'Invalid request. Press Ok to restart the use case',
          ...service.state.context,
        });
      }

      service.onStop(() => {
        logger.info('---------------------!!! Machine STOPPED !!!---------------------');
        delete keys[key];
      });
    }
  } else {
    logger.info('Request Token key is missing!');
    return res.json('Request Token key is missing!');
  }
});

// Routes for FSM transitions and actions
app.post('/fsm/login', (req, res) => {
  const key = req.body.key;
  if (key && keys[key]) {
    keys[key].service.send({ type: 'Login' });
    res.json({ message: "Navigating to Login page" });
  } else {
    res.status(400).json({ error: "Invalid key" });
  }
});

app.post('/fsm/signup', (req, res) => {
  const key = req.body.key;
  if (key && keys[key]) {
    keys[key].service.send({ type: 'Signup' });
    res.json({ message: "Navigating to Signup page" });
  } else {
    res.status(400).json({ error: "Invalid key" });
  }
});

// Error Handling Middleware
app.use((err, req, res, _next) => {
  logger.error('Internal Server Error', err.stack);  // Log the error stack with winston
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
