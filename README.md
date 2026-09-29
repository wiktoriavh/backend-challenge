# backend-challenge

## Setup

```
pnpm install
```

## Run

Check the package.json file to see the various ways to run it.

## Challenge

### Task 1

**Invoker**: no API endpoint is built here, but the invoker is the function that would receive an event from one. It needs to check that the event has the correct format before passing it to the processor. If the format is correct, pass the event along. If it isn't, fail early and inform whoever called it.

**Processor**: the processor's job is to change the event into the format the evaluator expects. The event is passed to the evaluator to check if it's right — right now, that throws an error. Adjust the processor so it doesn't.
