## Summary

| Method | Path                     | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/v1/account/signup` | Create new account         |
| POST   | `/api/v1/account/signin` | Sign into an account       |
| GET    | `/api/v1/account/verify` | Verify authorization       |
| POST   | `/api/v1/server/`        | Create new server          |
| GET    | `/api/v1/server/`        | List servers               |
| GET    | `/api/v1/server/{id}`    | Get server with ID {id}    |
| DELETE | `/api/v1/server/{id}`    | Delete server with ID {id} |
| PUT    | `/api/v1/server/{id}`    | Modify server with ID {id} |
| POST   | `/api/v1/notify/`        | Create new notifier        |

---

## Error structure
```json
{
	"error": "<message>",
	"code": "<http_status_code>",
	"details": "<error_details>" // nullable
}
```
---

# Account Routes
## POST `/signup`
Creates a new user account and returns a user object.
### Body

| Name           | Type     | Optional | Description              |
| -------------- | -------- | -------- | ------------------------ |
| `username`     | `String` | No       | Username of the new user |
| `password_raw` | `String` | No       | Password of the new user |
### Example Response
```json
{
	"id": 1,
	"username": "Jerry",
	"role": "user",
	"created_at": ...,
	"updated_at": ...
}
```

## POST /signin
Authorizes existing user in a system.

### Body

| Name           | Type     | Optional | Description          |
| -------------- | -------- | -------- | -------------------- |
| `username`     | `String` | No       | Username of the user |
| `password_raw` | `String` | No       | Password of the user |

### Example Response

```json
{
	"id": 1,
	"username": "Jerry",
	"role": "user",
	"created_at": ...,
	"updated_at": ...
}
```
And Cookie - `SID`

# Server Routes
## POST /server/
Creates new server object and returns it as a response.

### Body

| Name           | Type      | Optional | Description                              | Default |
| -------------- | --------- | -------- | ---------------------------------------- | ------- |
| `name`         | `String`  | No       | Name of the server                       |         |
| `url`          | `String`  | No       | URL of the server                        |         |
| `timeout`      | `Integer` | Yes      | The time server should respond in(secs)  | 10      |
| `interval`     | `Integer` | Yes      | The interval between server checks(secs) | 60      |
| `is_turned_on` | `Boolean` | Yes      | If this server should be checked at all? | false   |
## GET /server/
Lists all servers available for the current authorized user.

### Body
None
### Example Response

```json
[
	{
		"id": 1,
		"user_id": 1,
		"name": "JerryServer",
		"url": "https://google.com",
		"timeout": 10,
		"interval": 60,
		"last_seen_status_code": null, // or integer,
		"last_seen_reason": null, // or string,
		"is_turned_on": true,
		"created_at": ...,
		"updated_at": ...
	}
]
```

## GET /server/{id}
Gets the specified server by ID and returns its object. Its permitted to try getting server created by another user.

### Body
None
### Example Response
```json
{
	"id": 1,
	"user_id": 1,
	"name": "JerryServer",
	"url": "https://google.com",
	"timeout": 10,
	"interval": 60,
	"last_seen_status_code": null, // or integer,
	"last_seen_reason": null, // or string,
	"is_turned_on": true,
	"created_at": ...,
	"updated_at": ...
}
```

## DELETE `/server/{id}`
Delete the server by specified ID. This actions is restricted to a specific owner(user object owning this server) owning this server object.

### Body
None
### Example Response
```json
{
	"id": 1,
	"user_id": 1,
	"name": "JerryServer",
	"url": "https://google.com",
	"timeout": 10,
	"interval": 60,
	"last_seen_status_code": null, // or integer,
	"last_seen_reason": null, // or string,
	"is_turned_on": true,
	"created_at": ...,
	"updated_at": ...
}
```

## PUT `/server/{id}`
Update server by ID. This action is restricted to the owner of this server object.

### Body
| Name           | Type      | Optional | Description                              | Default |
| -------------- | --------- | -------- | ---------------------------------------- | ------- |
| `name`         | `String`  | No       | Name of the server                       |         |
| `url`          | `String`  | No       | URL of the server                        |         |
| `timeout`      | `Integer` | Yes      | The time server should respond in(secs)  | 10      |
| `interval`     | `Integer` | Yes      | The interval between server checks(secs) | 60      |
| `is_turned_on` | `Boolean` | Yes      | If this server should be checked at all? | false   |
### Example Response
```json
{
	"id": 1,
	"user_id": 1,
	"name": "JerryServer",
	"url": "https://google.com",
	"timeout": 10,
	"interval": 60,
	"last_seen_status_code": null, // or integer,
	"last_seen_reason": null, // or string,
	"is_turned_on": true,
	"created_at": ...,
	"updated_at": ...
}
```

### TODO