| Method        | Path          | Who can call     | Request body       | Success     | Errors        |
| ------------- | ------------- | ---------------- | ------------------ | ----------- | ------------- |
| GET           | /rooms?page=1 | anyone logged in | -                  | 200 Room[]  | 401           |
| POST          | /rooms        | admin            | { name, capacity } | 201 Room    | 400, 401, 403 |
| PATCH         | /bookings/:id | owner, admin     | { start?, end? }   | 200 Booking | 400, 401,     |
| 403, 404, 409 |
| DELETE        | /bookings/:id | owner, admin     | -                  | 204         | 401, 403, 404 |

Error format (all endpoints):
{ "statusCode": 400, "message": ["capacity must be a positive number"], "error": "Bad
Request" }
