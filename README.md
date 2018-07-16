# tsh

## Telegram Shell

Proof of concept of remote shell over Telegram.

## Up and running

Clone this repo, and create a config.js file with the following fields (You'll need to get a bot API key from [@BotFather](https://t.me/BotFather)):

```JavaScript
module.exports = {
	botApiKey: '94365321:AAGM6_3QK_RC49SA1281zC5U_nmMF',
	masterID: 12345678,
};
```

Do `npm install` to install dependencies (I recommend [pnpm](https://github.com/pnpm/pnpm) instead).

Run `npm start`.

Try running `/start` in your bot's private.

## Commands

- `/start` creates a new session.
- `/ls` list of active sessions.
- `/detach [session-identifier]` disconnect from session.
- `/attach <session-identifier>` reconnect to session.
- `/kill <session-identifier>` kill session.

## Known issues

- `tsh` doesn't play well with commands that require password from stdin, like `sudo`, or any command that creates a new shell (like `bash`). As a workaround, you could use `sudo -S` to read password from stdin. These may be fixed in a later version.

- Some times, the same response will be sent several times as the stream is triggered. This is fixable, and will be done soon.

## Security

`tsh` is recommended to be used by a single user only, for your personal needs. Therefore, you must host your own bot on the server. Support for multiple machines may come in future.

If you wouldn't trust Telegram with your content (especially sensitive content like passwords), please refrain from using this bot at all costs. It's a proof of concept and should be seen as such, and would be a massive breach of security to have sensitive content over Telegram.

Finally, feel free to fork or contribute. `tsh` is licensed under the terms of the permissive MIT license.
