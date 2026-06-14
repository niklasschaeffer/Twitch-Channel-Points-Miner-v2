![Twitch Channel Points Miner - v2](https://raw.githubusercontent.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2/master/assets/banner.png)

<p align="center">
<a href="https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2/releases"><img alt="Latest Version" src="https://img.shields.io/github/v/release/niklasschaeffer/Twitch-Channel-Points-Miner-v2?style=flat&color=white&logo=github&logoColor=white"></a>
<a href="https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/niklasschaeffer/Twitch-Channel-Points-Miner-v2?style=flat&color=limegreen&logo=github&logoColor=white"></a>
<a href='https://github.com/MShawon/github-clone-count-badge'><img alt='GitHub Traffic' src='https://img.shields.io/badge/dynamic/json?style=flat&color=blue&label=views&query=count&url=https://gist.githubusercontent.com/niklasschaeffer/<TRAFFIC_GIST_ID>/raw/traffic.json&logo=github&logoColor=white'></a>
<a href='https://github.com/MShawon/github-clone-count-badge'><img alt='GitHub Clones' src='https://img.shields.io/badge/dynamic/json?style=flat&color=purple&label=clones&query=count&url=https://gist.githubusercontent.com/niklasschaeffer/<CLONE_GIST_ID>/raw/clone.json&logo=github&logoColor=white'></a>
<a href="https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/niklasschaeffer/Twitch-Channel-Points-Miner-v2?style=flat&color=black&logo=unlicense&logoColor=white"></a>
<a href="https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/niklasschaeffer/Twitch-Channel-Points-Miner-v2?style=flat&color=lightyellow&logo=github&logoColor=white"></a>
</p>

<p align="center">
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Version" src="https://img.shields.io/docker/v/niklasschaeffer/twitch-channel-points-miner-v2?style=flat&color=white&logo=docker&logoColor=white&label=release"></a>
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Stars" src="https://img.shields.io/docker/stars/niklasschaeffer/twitch-channel-points-miner-v2?style=flat&color=limegreen&logo=docker&logoColor=white&label=stars"></a>
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/niklasschaeffer/twitch-channel-points-miner-v2?style=flat&color=blue&logo=docker&logoColor=white&label=pulls"></a>
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Images Size AMD64" src="https://img.shields.io/docker/image-size/niklasschaeffer/twitch-channel-points-miner-v2/latest?arch=amd64&label=AMD64 image size&style=flat&color=purple&logo=amd&logoColor=white"></a>
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Images Size ARM64" src="https://img.shields.io/docker/image-size/niklasschaeffer/twitch-channel-points-miner-v2/latest?arch=arm64&label=ARM64 image size&style=flat&color=black&logo=arm&logoColor=white"></a>
<a href="https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2"><img alt="Docker Images Size ARMv7" src="https://img.shields.io/docker/image-size/niklasschaeffer/twitch-channel-points-miner-v2/latest?arch=arm&label=ARMv7 image size&style=flat&color=lightyellow&logo=arm&logoColor=white"></a>
</p>

<h1 align="center">Twitch Channel Points Miner (niklasschaeffer Fork)</h1>

A **fork** of [Armi1014/Twitch-Channel-Points-Miner-v2](https://github.com/Armi1014/Twitch-Channel-Points-Miner-v2) with an added `!lurk` chat feature.

Built for people who want:
- **better watch streak reliability**
- **cleaner favorite / priority behavior**
- **faster startup in real use**
- **less transient Twitch/API/network log noise**
- **automatic `!lurk` message when joining a streamer's chat on first online connection**

> Not affiliated with Twitch. Use at your own risk.

## Quick Start

```sh
git clone https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2
cd Twitch-Channel-Points-Miner-v2
cp example.py run.py
uv sync
uv run run.py
```

Hermes is the default websocket backend in this fork. If you need the legacy PubSub path, set `USE_HERMES = False` in your runner file.

**Pip Alternative**

```sh
python -m venv .venv
source .venv/bin/activate
cp example.py run.py
pip install -r requirements.txt
python run.py
```

## Why this fork

Compared to upstream, this fork focuses on **reliability first**:

* better handling of transient Twitch/API/network issues
* more reliable watch streak behavior, including already-online channels at startup
* per-account streak cache files to avoid multi-account conflicts
* clearer `Priority.FAVORITE` behavior
* faster startup and less waiting during the initial refresh cycle
* reduced recurring timeout / backend error log spam
* Hermes websocket support with explicit PubSub fallback

**Example startup improvement**

* upstream sample: `179s`
* this fork sample: `14s`
* about **12.8x faster** in that test

Results vary depending on account size, network quality, and Twitch backend health.
The exact number will vary, but faster startup is a core goal of this fork, not just a side effect.

## Use this fork if...

* you care more about **reliability** than staying as close as possible to upstream
* you use **watch streaks** heavily
* you want clearer favorite / priority behavior
* you want the miner to become usable faster after launch
* you want fewer annoying transient error logs

## Subscription Notifications

This fork can send `Events.SUBSCRIPTION` notifications to Discord or other webhook-style integrations.

What it does:

* listens for Twitch IRC `USERNOTICE` events
* formats a cleaner subscription message with the streamer/channel and current points
* only alerts for subscription events that are about **your own account**

What counts as "about your own account":

* you subscribe
* you renew a subscription
* you receive a sub gift
* you upgrade a gift or Prime subscription

What it ignores:

* other viewers subscribing
* other viewers renewing
* other viewers receiving gifted subs

Important:

* this depends on IRC chat being enabled for that streamer
* `chat=ChatPresence.NEVER` disables this feature for that channel
* `chat=ChatPresence.ONLINE` is enough

See [example.py](example.py) for a basic Discord webhook configuration example.

## Docs

* [Latest Releases](https://github.com/niklasschaeffer/Twitch-Channel-Points-Miner-v2/releases)
* [Docker Hub](https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2)
* [Example Config](example.py)
* [Fork Features](FORK_FEATURES.md)
* [FAQ](FAQ.md)
* [Contributing](CONTRIBUTING.md)

> **Note:** After the first successful badge workflow run, replace `<TRAFFIC_GIST_ID>` and `<CLONE_GIST_ID>` in the README badge URLs with the actual Gist IDs stored in the `TRAFFIC_ID` and `GIST_ID` repository secrets.

## `!lurk` Feature

This fork can automatically send `!lurk` in a streamer's chat when the bot first joins after the streamer goes online.

### Enable per streamer

```python
Streamer(
    "streamer_name",
    settings=StreamerSettings(send_lurk=True),
)
```

### Requirements

* IRC chat must be enabled for that streamer (`chat` must not be `ChatPresence.NEVER`).
* The message is sent only once per IRC session.

## Docker

A pre-built image is available on [Docker Hub](https://hub.docker.com/r/niklasschaeffer/twitch-channel-points-miner-v2):

```sh
docker pull niklasschaeffer/twitch-channel-points-miner-v2:latest
```

Build it yourself:

```sh
docker build -t niklasschaeffer/twitch-channel-points-miner-v2 .
```
