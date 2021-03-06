# Interview Scheduler

Scheduler is a single page application built using React. It allows users to book and cancel interviews. Also, it combines a concise API with WebSocket sever to build a realtime experience.

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```


## Final Product

!["screenshot of scheduler overview"](https://github.com/maggiezhao11/scheduler/blob/master/docs/scheduler-overview.png)

!["screenshot of interview form"](https://github.com/maggiezhao11/scheduler/blob/master/docs/interview-form.png)

!["screenshot of cancel confirm mode"](https://github.com/maggiezhao11/scheduler/blob/master/docs/cancel-confirm.png)

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm start` command. The app will be served at <http://localhost:8000/> for App.
3. Start a second terminal for the API web server using the `npm start` command. The scheduler-api will be served at <http://localhost:8001/> for API.
4. Go to <http://localhost:8080/> in your browser while having both terminal open running two servers.
5. Open another browser window in order to experience the realtime experience with WebSocket server for tracking remaining spots everyday.
5. Deploy it on Netlify. Go to <https://gracious-keller-b31420.netlify.app/> in your browser, and have a fun with the scheduler app.


## Dependencies
- axios
- Node 12.x or above
- react
- react-dom
- react-test-renderer
- react-scripts
- nvm
- normalize.css
- classnames



## Function
- Create new interview for user in empty slot
- Displays existing interviews per day
- Edit existing interviews 
- Delete existing interviews
- Offer realtime experience to multiple users on spot remaining information.
- Switch views based on user requests
