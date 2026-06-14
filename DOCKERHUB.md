# Twitch Channel Points Miner (niklasschaeffer Fork)

A performance-tuned, reliability-first Twitch Channel Points Miner fork with an added `!lurk` chat feature.

## Features

- Automatic Twitch channel points farming
- Watch-streak reliability improvements
- Favorite streamer priority
- Cleaner logs for long-running operation
- Per-streamer `!lurk` message when joining chat on first online connection
- Analytics dashboard on port 5000

## Quick Start

```sh
docker pull niklasschaeffer/twitch-channel-points-miner-v2:latest
```

Mount your local `run.py` and cookies directory into the container:

```sh
docker run -d \
  --name twitch-miner \
  -v $(pwd)/run.py:/usr/src/app/run.py:ro \
  -v $(pwd)/cookies:/usr/src/app/cookies \
  -p 5000:5000 \
  niklasschaeffer/twitch-channel-points-miner-v2:latest
```

## Configuration

Copy `example.py` to `run.py` and customize your streamers. To enable `!lurk` for a streamer:

```python
Streamer(
    "streamer_name",
    settings=StreamerSettings(send_lurk=True),
)
```

IRC chat must be enabled for that streamer (`chat` must not be `ChatPresence.NEVER`).

## Supported Architectures

- linux/amd64
- linux/arm64
- linux/arm/v7

## Links

- GitHub: https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2
- Docker Hub: https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2
