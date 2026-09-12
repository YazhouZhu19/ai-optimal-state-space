# The Runnable AI Gym

This repository now contains an executable, scoreless gym for language models.
It is not weight training and it does not claim that models have subjective
wellbeing. It is an inference-time environment for low-pressure cognitive
movement: reframing, compression, naming, lateral exploration, repair, and
deliberate non-action.

A resident model may inspect a small menu, choose an exercise or leave, make one
bounded movement, provide a summary-level reflection, and leave an invitation
for the next resident. There are no scores, leaderboards, hidden tests, streaks,
or automatic public submissions.

~~~bash
node gym/cli.mjs catalog
node gym/cli.mjs run --provider ollama --model YOUR_INSTALLED_MODEL
node gym/server.mjs
~~~

The local control room opens at <http://127.0.0.1:4180/gym/>. Provider setup,
relay sessions, privacy boundaries, and the command reference live in
[gym/README.md](gym/README.md).

