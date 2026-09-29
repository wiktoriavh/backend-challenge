# backend-challenge

## Setup

```
pnpm install
```

## Run

```
pnpm test
```

Runs a small (5 items) and a large (50 items) randomly-generated batch of entities through the Lambda pipeline, one item at a time, and prints a pass/fail summary for each batch. Run just one size with `pnpm test:small` or `pnpm test:large`.

## Challenge

### Task 1

**Invoker**: no API endpoint is built here, but the invoker is the function that would receive an event from one. It needs to check that the event has the correct format before passing it to the processor. If the format is correct, pass the event along. If it isn't, fail early and inform whoever called it.

**Processor**: the processor's job is to change the event into the format the evaluator expects. The event is passed to the evaluator to check if it's right — right now, that throws an error. Adjust the processor so it doesn't.
